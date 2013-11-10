<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">
<head>
<title><?php print $head_title ?></title>
<?php print $head ?><?php print $styles ?><?php print $scripts ?>
</head>
<body class="<?php if (arg(0) == "admin" ) echo "dfadmin"; ?>">
<div class="header">
  <?php
          // Prepare header
          $site_fields = array();
          if ($site_name) {
            $site_fields[] = check_plain($site_name);
          }
          if ($site_slogan) {
            $site_fields[] = check_plain($site_slogan);
          }
          $site_title = implode(' ', $site_fields);
          if ($site_fields) {
            $site_fields[0] = '<span>'. $site_fields[0] .'</span>';
          }
          $site_html = implode(' ', $site_fields);

          if ($logo || $site_title) {
            print '<h1><a href="'. check_url($front_page) .'" title="'. $site_title .'"><img src="'. check_url($logo) .'" alt="'. $site_title .'" id="logo" /></a></h1>';
          }
                    
        ?>
  <ul class="toplinks">
    <?php  if($user->uid){ ?>
    <li>Logged in as: <?php print l($user->name,'user/'.$user->uid); ?></li>
    <li><?php print l("logout","logout"); ?></li>
    <?php } else{ ?>
    <li><a href='<?php print base_path(); ?>user'>Login</a></li>
    <li><a href='<?php print base_path(); ?>user/register'>Register</a></li>
    <?php } ?>
  </ul>
</div>
<div class="navigation">
  <?php if (isset($primary_links)) : ?>
  <?php print theme('links', $primary_links, array('class' => 'links primary-links')) ?>
  <?php endif; ?>
  <a href="<?php print base_path(); ?>rss.xml" class="sub_rss" title="Subscribe to RSS">Subscribe to RSS</a>
  <?php if ($search_box): ?>
  <?php print $search_box ?>
  <?php endif; ?>
</div>
<?php if ($right): ?>
<div class="bodyr">
  <?php endif; ?>
  <div class="body">
    <?php if ($tabs): print '<ul class="tabs primary">'. $tabs .'</ul>'; endif; ?>
    <?php if ($tabs2): print '<ul class="tabs secondary">'. $tabs2 .'</ul>'; endif; ?>
    <?php if ($show_messages && $messages): print $messages; endif; ?>
    <?php if ($title): print '<h2'. ($tabs ? ' class="with-tabs"' : '') .'>'. $title .'</h2>'; endif; ?>
    <?php print $content ?> </div>
  <?php if ($right): ?>
  <div class="sidebar"> <?php print $left; ?><?php print $right; ?> </div>
</div>
<div class="clear"></div>
<?php endif; ?>
<div class="footer">
  <p class="theme">Theme by <a href="http://dezinerfolio.com" target="_blank" title="Theme by Dezinerfolio">Dezinerfolio</a></p>
  <?php print $footer_message ?></div>
<?php print $closure ?>
</body>
</html>
