<?php
// $Id: comment.tpl.php,v 1.1 2008/12/12 07:07:03 navdeepraj Exp $
?>

<div class="comment<?php print ($comment->new) ? ' comment-new' : ''; print ' '. $status; print ' '. $zebra; ?>">
  <?php
$splitedstring=explode("—",$submitted);
?>
  <div class="n_comment">
    <div class="n_subject"><?php print $content ?></div>
    <div class="n_bar">
      <div class="n_name"><?php print $splitedstring[1]; ?></div>
      <div class="n_date"><?php print $splitedstring[0]; ?></div>
      <div class="n_links">
        <?php if ($links): ?>
        <?php print $links ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
