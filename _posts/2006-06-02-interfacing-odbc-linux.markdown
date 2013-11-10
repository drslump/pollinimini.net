---
layout: post
title: Interfacing ODBC from Linux
category: Code
tags: [ odbc, php ]
---

Our billing software runs on Windows platforms and uses ODBC to store its data.
Recently we called the makers of that software since we wanted to extract some
Business Intelligence from our records.

It turned out that they where going to release a new program for that purpose.
We asked to evaluate the beta version and to my surprise it just created an
Microsoft Excel file with a dynamic table report.

So I worked on the needed SQL query to extract the records we wanted and
exported the data into a CSV to be loaded in an Excel worksheet with a dynamic
table report. It worked ok, however the sales and marketting people didn’t want
to contact a technician every time they needed the reports to be updated.

The problem was that our application server is a Debian box and since we didn’t
have to much time to expend on this, we looked for the easiest solution. I
found [ODBC Socket Server][0] which seems unmaintained but the last version works
ok on our Windows Server 2003 machine. It’s a service which acts as a proxy for
ODBC databases in the local machine, so they can be accessed from other machines
using a socket connection and a very simple XML grammar. Once everything was in
place I wrote a simple PHP program to fetch the needed records (a few thousand
rows). To my surprise the available PHP libraries to interact with ODBC Socket
Server didn’t perform too well. They stored the full response in memory and
then build up an array, since we need a few thousend rows, the amount of memory
required was too high for our little Debian system.

The following code is a pretty simple set of classes to work with ODBC Socket
Server. They fetch the data on demand, using a SAX type xml parser to discard
the already processed records. It’s not a really thought of or tested solution,
however I’m making it public since it’s far better than existing solutions.

{% highlight php %}
<?php
/*
  The ODBCSock class is an utility object to operate with the ODBC Socket Server
  from http://odbcsock.sourceforge.net

  It's compatible with ODBC Socket Server's XML formats 0 and 2. In our tests
  xml format 2 is significally faster than the others.
  Should run on PHP4 and PHP5, however it's only been tested on PHP5

  This code is copyright (c) 2006 Netxus Foundries
  v1.0 28-May-2006 : Ivan -DrSlump- Montes <imontes@netxus.es>

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
  or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
  for more details.
  You should have received a copy of the GNU General Public License along
  with this program; if not, write to the Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA
*/

class ODBCSock {
  var $handle = null;
  var $server = 'localhost';
  var $port = '9628';
  var $username = '';
  var $password = '';
  var $database = '';

  function ODBCSock( $server, $user, $passwd, $database = false )
  {
    $server = explode(':', $server);
    if (count($server) > 1)
      $this->port = array_pop( $server );
    else
      $this->port = 9628;
    $this->server = implode(':', $server);

    $this->handle = fsockopen( $this->server, $this->port, $errNo, $errStr, 30 );
    if ( ! $this->handle ) {
      return null;
    }

    $this->username = $user;
    $this->password = $passwd;

    if ($database !== false)
      $this->selectDB( $database );
  }


  function selectDB( $database )
  {
    $this->database = $database;
  }


  function & query( $query )
  {
    $pl = array();
    $pl[] = '<?xml version="1.0"?>';
    $pl[] = '<request>';
    $pl[] = '<connectionstring>DSN=' . HTMLSpecialChars($this->database) . ';UID=' . HTMLSpecialChars($this->username) . ';PWD=' . HTMLSpecialChars($this->password) . ';</connectionstring>';
    $pl[] = '<sql>' . HTMLSpecialChars( $query ) . '</sql>';
    $pl[] = '</request>';

    fwrite( $this->handle, implode("\r\n", $pl) );

    $rs = new ODBCSock_Result( $this );
    if ($rs->sax->error) return FALSE;
    else return $rs;
  }
}


class ODBCSock_Result {
  var $rows = array();
  var $conn;
  var $lastRow = 0;

  function ODBCSock_Result( &$conn )
  {
    $this->conn =& $conn;

    $this->sax = new ODBCSock_SAX( $this );
    $this->parser = xml_parser_create();
    xml_set_object( $this->parser, $this->sax );
    xml_parser_set_option( $this->parser, XML_OPTION_CASE_FOLDING, false );

    xml_set_element_handler( $this->parser, 'startElement', 'endElement' );
    xml_set_character_data_handler( $this->parser, 'content' );

    while ( $this->_read() ) {
      if ($this->sax->error || $this->sax->parsing)
        break;
    }
  }

  function _eof()
  {
          return feof($this->conn->handle);
  }

  function _read()
  {
          xml_parse( $this->parser, fread( $this->conn->handle, 4096 ), feof($this->conn->handle) );
  }

  function addRow( $row )
  {
          $this->rows[] = $row;
  }


  function fetch( $row = false )
  {
    if ($row === false) {
      $row = $this->lastRow;
      $this->lastRow++;
    } else {
      $this->lastRow = $row+1;
    }

    do {
      $this->_read();

      if (isset($this->rows[$row]))
        return $this->rows[$row];

    } while ( !$this->_eof() );
  }
}

class ODBCSock_SAX {

  var $error = false;
  var $parsing = false;

  var $curElement = '';
  var $curColumn = '';
  var $curColumnIdx = 0;
  var $curRowIdx = 0;

  var $rs = null;
  var $row;
  var $labels = array();

  function ODBCSock_SAX   ( &$rs )
  {
    $this->rs =& $rs;
  }

  function startElement( $parser, $name, $attrs )
  {
    $this->curElement = $name;

    if ( $name == 'result' ) {
      if ($attrs['state'] == 'success')
        $this->parsing = true;
      else
        $this->error = true;
    } else if ( $name == 'row' ) {
      $this->row = array();
      $this->curColumnIdx = 0;
    } else if ($name == 'column') {
      if ($attrs['name']) {
        if ($curRowIdx == 0)
                $this->labels[] = $attrs['name'];

        $this->curColumn = $attrs['name'];
      } else {
        $this->curColumn = $this->labels[$this->curColumnIdx];
      }

      $this->row[ $this->curColumn ] = '';
      $this->curColumnIdx++;
    }
  }

  function endElement( $parser, $name )
  {
    if ( $name == 'row' ) {
      $this->rs->addRow( $this->row );
      $this->curRowIdx++;
    }
  }

  function content( $parser, $data )
  {
    if ($this->curElement == 'column') {
      $this->row[ $this->curColumn ] .= $data;
    }
  }
}
{% endhighlight %}



[0]: http://odbcsock.sourceforge.net/