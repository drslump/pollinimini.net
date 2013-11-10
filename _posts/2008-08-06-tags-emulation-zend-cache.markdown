---
layout: post
title: Tags emulation for Zend_Cache
category: Code
tags: [zf, cache, webdev, php, zend, memcached]
disqus: http://pollinimini.net/blog/tags-emulation-zendcache
---

Managing a cache is a complex task, at first you start placing random stuff on
it, when you need to squeeze a few more hits per second you keep adding stuff
to the cache. At the end of the day, if you've not planned it carefully, you
might end up with a nightmare of stale data in your pages or even a completely
broken site.

One easy way to apply some logic to the cached data and help in the invalidation
of cached stuff is the use of tags. Cache tags are a simple way to group cached
items so it gets easy to remove/invalidate them if needed. For example, if we
have an online shop and we are caching paginated list of items by their category,
then we might have keys like `list-{category}-{startOffset}`, if we add a new
item to our shop we have to invalidate all the cached partial lists (since it
could be at any position in the list). If we apply a simple tag, like
`list-{category}` to the cached lists we can group them and proceed to their
invalidation when a new product is added or moved to a given category, so our
online data is always fresh.

The [Zend Framework][1] implements tag support in its cache component, but
unfortunately not APC neither the high performance Memcached do support grouping
or tags. For the later one there is a fork/patch, [memcached-tag][2], however
it does not seem to be very mature yet as to use in production.

Still not everything is lost, we can emulate tag support by keeping ourselves a
relation between cache keys and tags. The first thing that comes to mind is to
self-store this relation in the cache, however APC and Memcached may drop a
cache item without further notice, they are caches not persistency layers, so
we need to find a persistent store to keep this information. The solution below
uses a PDO connection (MySQL, Sqlite, Oracle…) to keep the relation between keys
and tags in a table, this table is updated each time there is a cache write
(with tags) and when cleaning by tag, so it shouldn't hurt much performance if
your cache hit is high (the overhead won't matter much anyway if you get a lot
of misses).

By the way, the code is licensed under the BSD License, so feel free to use it
at will as long as you keep the copyright notice in place.

[Download it from my public subversion repository.][3]

If we only have a single server we can use a simple Sqlite database. For
distributed memcached servers we'll need a server based database system like
MySql (Note: To improve performance in MySQL it's desirable to use the Memory
table engine if we don't need the cache to survive our MySQL instance).

Following is a simple usage example for the class (Remember to rename the file
to the usual ZF directory structure `Zend/Cache/Backend/Tags.php`).

{% highlight php %}
<?php
// Setup the cache
$frontOpts = array(
   'lifetime' => 3600
);
$backOpts = array(
  // Setup the real cache backend
  'backend' => array(
    'class' => 'Zend_Cache_Backend_Apc',
    'options' => array(
    ),
  ),
  // Configure the persistent store for the keys-tags mapping
  'pdo' => array(
    'dsn' => 'mysql:host=127.0.0.1;dbname=cachedb',
    'user' => 'dbuser',
    'password' => 'dbpass',
  ),
  // Set to true if you want to delete non tagged keys
  'track_untagged' => false,
  // Set this to true if you don't want to have duplicates in the table,
  // it could improve performace a bit
  'duplicates_ok' => false
);

// Create the cache object
$cache = Zend_Cache::factory( 'core', 'tags', $frontOps, $backOps );

// Store some stuff in the cache
$cache->save( 'My cached data #1', 'cacheA', array('tagA') );
$cache->save( 'My cached data #2', 'cacheB', array('tagA') );
$cache->save( 'My cached data #3', 'cacheC', array('tagB') );

// Clean all the keys with tagA
$cache->clean( Zend_Cache::CLEANING_MODE_MATCHING_TAG, array('tagA') );
{% endhighlight %}


Update 2009-03-07
-----------------

Jan ‘Mithrandir’ Pedersen has provided in the comments a modification of the
class based on Zend_Db_Table instead of PDO. Here is the code:

{% highlight php %}
<?php
/**
 * Zend_Cache Tags emulator for backends not supporting them natively
 *
 * It'll use a Zend_Db_Table_Abstract object to persist the mapping
 * between cache keys and its tags.
 *
 * @author ZooCMS Crew
 * @credits Iván -DrSlump- Montes <drslump AT pollinimini DOT net>
 * @copyright Copyright (c) 2009 ZooCMS Crew
 * @copyright Copyright (c) 2008 Iván -DrSlump- Montes <http://pollinimini.net>
 * @version 1.0
 * @license BSD
 */

class Zoo_Cache_Backend_Tags extends Zend_Cache_Backend implements Zend_Cache_Backend_Interface
{
    /**
     * Available options
     *
     * =====> (Zend_Cache_Core) backend:
     * A Zend_Cache_Backend object or an associative array declaring its configuration:
     * 'class' => (string) The full class name of the backend
     * 'options' => (array) The array of options passed to the class constructor
     *
     * =====> (array) table:
     * An associative array with the Zend_Db_Table_Abstract class data:
     * 'class' => string) The full class name of the backend
     * 'options' => (array) additional configuration parameters to use with Zend_Db_Table_Abstract::__construct()
     * It is assumed that the table will have an 'cacheid' and a 'tag' column
     *
     * =====> (book) track_untagged:
     * If true it will keep track of untagged items so they can be purged by the NOT_MATCHING_TAG mode
     *
     * =====> (book) duplicates_ok:
     * If true it won't make sure that there are no duplicate entries in the database.
     *
     * @var array available options
     */
    protected $_options = array(
        'backend' => null,
        'table' => null,
        'track_untagged'=> false,
        'duplicates_ok' => false
    );

    /**
     * Zend_Cache_Core object
     *
     * @var Zend_Cache_Core object
     */
    private $_backend = null;

    /**
     * Table object
     *
     * @var Zend_Db_Table_Abstract object
     */
    private $_table = null;

    /**
     * Constructor
     *
     * @param array $options associative array of options
     * @throws Zend_Cache_Exception
     * @return void
     */
    public function __construct($options = array())
    {
        parent::__construct($options);

        if ( is_array($options['backend']) ) {

            $backendClass = $options['backend']['class'];

            $this->_backend = new $backendClass($options['backend']['options']);

        } else if ( $options['backend'] instanceof Zend_Cache_Backend_Interface ) {

            $this->_backend = $options['backend'];

        } else {
            Zend_Cache::throwException('The backend option is not correctly set!');
        }

        if (!is_array($options['table'])) {
            Zend_Cache::throwException('The table option is not correctly set!');
        }
    }

    /**
     * Test if a cache is available for the given id and (if yes) return it (false else)
     *
     * @param string $id Cache id
     * @param boolean $doNotTestCacheValidity If set to true, the cache validity won't be tested
     * @return string|false cached datas
     */
    public function load($id, $doNotTestCacheValidity = false)
    {
        $result = $this->_backend->load( $id, $doNotTestCacheValidity );

        // If not in cache make sure to delete the tag mapping to handle cache expiration
        if ( $result === false && !$this->_options['duplicates_ok'] ) {
            $where = $this->getTable()->getAdapter()->quoteInto('cacheid = ?', $id);
            $this->getTable()->delete($where);
        }

        return $result;
    }

    /**
     * Get Zend_Db_Table_Abstract object for persistence
     */
    protected function getTable() {
        if (!$this->_table) {
            $tableClass = $this->_options['table']['class'];
            $this->_table = new $tableClass($this->_options['table']['options']);
        }
        return $this->_table;
    }

    /**
     * Test if a cache is available or not (for the given id)
     *
     * @param string $id Cache id
     * @return mixed|false (a cache is not available) or "last modified" timestamp (int) of the available cache record
     */
    public function test($id) {
        return $this->_backend->test($id);
    }

    /**
     * Save some string datas into a cache record
     *
     * Note : $data is always "string" (serialization is done by the
     * core not by the backend)
     *
     * @param string $data Datas to cache
     * @param string $id Cache id
     * @param array $tags Array of strings, the cache record will be tagged by each string entry
     * @param int $specificLifetime If != false, set a specific lifetime for this cache record (null => infinite lifetime)
     * @return boolean True if no problem
     */
    public function save($data, $id, $tags = array(), $specificLifetime = false)
    {
        $result = $this->_backend->save( $data, $id, array(), $specificLifetime );

        if ( $result ) {
            // Makes sure to always store the key for notMatchingTag cleaning mode
            if ( $this->_options['track_untagged'] && !count($tags) ) {
                $tags = array('');
            }

            if ( count($tags) ) {
                foreach ( $tags as $tag ) {
                    $result = $this->getTable()->fetchAll(
                                $this->getTable()->select()
                                    ->where('cacheid = ?', $id)
                                    ->where('tag = ?', $tag)
                    );

                    if (!$result->count()) {
                        $row = $this->getTable()->createRow(array('cacheid' => $id, 'tag' => $tag));
                        $row->save();
                    }
                }
            }
        }

        return $result;
    }

    /**
     * Remove a cache record
     *
     * @param string $id Cache id
     * @return boolean True if no problem
     */
    public function remove($id)
    {
        if ( !$this->_options['duplicates_ok'] ) {
            $where = $this->getTable()->getAdapter()->quoteInto('cacheid = ?', $id);
            $this->getTable()->delete($where);
        }

        return $this->_backend->remove($id);
    }

    /**
     * Clean some cache records
     *
     * Available modes are :
     * 'all' (default) => remove all cache entries ($tags is not used)
     * 'old' => remove too old cache entries ($tags is not used)
     * 'matchingTag' => remove cache entries matching all given tags
     * ($tags can be an array of strings or a single string)
     * 'notMatchingTag' => remove cache entries not matching one of the given tags
     * ($tags can be an array of strings or a single string)
     *
     * @param string $mode Clean mode
     * @param array $tags Array of tags
     * @return boolean True if no problem
     */
    public function clean($mode = Zend_Cache::CLEANING_MODE_ALL, $tags = array())
    {
        if ( $mode == Zend_Cache::CLEANING_MODE_MATCHING_TAG ||
             $mode == Zend_Cache::CLEANING_MODE_NOT_MATCHING_TAG ) {

            if ( !is_array($tags) ) {
                $tags = array($tags);
            }

            // Quote the tags and convert to a string
            $tags = array_map(array($this->getTable()->getAdapter(), 'quote'), $tags);

            // Build the query for the desired matching mode
            if ( $mode == Zend_Cache::CLEANING_MODE_MATCHING_TAG ) {
                $items = $this->getTable()->select()->where('tag IN (?)', $tags);
            } else {
                $items = $this->getTable()->select()->where('tag NOT IN (?)', $tags);
            }

            foreach ( $items as $item ) {
                $this->remove( $item->cacheid );
            }

            return true;

        } else {

            return $this->_backend->clean($mode, $tags);

        }
    }


    /**
     * Magic call handler to forward to the real backend the method calls
     *
     * @param string $method The method called
     * @param array $args The arguments used packed as an array
     * @return mixed
     */
    public function __call( $method, $args )
    {
        return call_user_method_array( $method, $this->_backend, $args );
    }
}
{% endhighlight %}


[1]: http://framework.zend.com/
[2]: http://code.google.com/p/memcached-tag
[3]: http://svn.pollinimini.net/public/Zend_Cache_Backend_Tags.php
