<?php

class SearchPostURL extends Search
{
	function find ($pattern)
	{
		global $wpdb;

		$results = array ();
		$posts   = $wpdb->get_results ("SELECT ID, post_name, post_title FROM {$wpdb->posts} ORDER BY ID");
		if (count ($posts) > 0)
		{
			foreach ($posts AS $post)
			{
				if (($matches = $this->matches ($pattern, $post->post_name, $post->ID)))
				{
					foreach ($matches AS $match)
						$match->title = $post->post_title;
					
					$results = array_merge ($results, $matches);
				}
			}
		}

		return $results;
	}
	
	function get_options ($result)
	{
		$options[] = '<a href="'.get_permalink ($result->id).'">'.__ ('view', 'search-regex').'</a>';
		if ($result->replace)
			$options[] = '<a href="#" onclick="regex_replace (\'SearchPostURL\','.$result->id.','.$result->offset.','.$result->length.',\''.str_replace ("'", "\'", $result->replace_string).'\'); return false">replace</a>';
			
		if (current_user_can ('edit_post', $result->id))
			$options[] = '<a href="'.get_bloginfo ('wpurl').'/wp-admin/post.php?action=edit&amp;post='.$result->id.'">'.__ ('edit','search-regex').'</a>';
		return $options;
	}
	
	function show ($result)
	{
		printf (__ ('Post #%d: %s', 'search-regex'), $result->id, $result->title);
	}
	
	function name () { return __ ('Post URL', 'search-regex'); }
	
	function get_content ($id)
	{
		global $wpdb;

		$post = $wpdb->get_row ("SELECT post_name FROM {$wpdb->prefix}posts WHERE id='$id'");
		return $post->post_name;
	}
	
	function replace_content ($id, $content)
	{
		global $wpdb;
		$content = wpdb::escape ($content);
		$wpdb->query ("UPDATE {$wpdb->posts} SET post_name='{$content}' WHERE ID='$id'");
	}
}

?>