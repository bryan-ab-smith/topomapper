<?php
	
	include "credentials.php";
	
	//$searchTerm = $_GET["query"];
	$searchType = $_GET["searchtype"];
	$searchValue = $_GET["value"];
	
	$searchTerm = str_replace("'", "''", $searchTerm);
	$searchTerm = str_replace("\"", '\"', $searchTerm);
	
	$firstChar = substr($searchTerm, 0, 7);
	$searchTag = substr($searchTerm, 7);
	
	$conn = new mysqli($host, $user, $pass, $db);
	$json_results = array();
	
	if (empty($searchType) || empty($searchValue)) {
		$query = "SELECT * FROM topomapper WHERE hide='n'";
	} else {
		if ($searchType == "tag") {
			$query = "SELECT * FROM topomapper WHERE tag LIKE '%" . $searchValue . "%' AND hide='n'";
		} else if ($searchType == "story") {
			$query = "SELECT * FROM topomapper WHERE story LIKE '%" . $searchValue . "%' AND hide='n'";
		}
	}

	$geojson = array('type' => 'FeatureCollection', 'features' => array());
	$results = $conn->query($query);

	// http://stackoverflow.com/a/19992351
	while($row = $results->fetch_assoc()) {
		$coords = array($row['lng'], $row['lat']);
		$story = $row['story']; //$row['story'] + '<p></p>' + $row['tag'] + '<p></p>' + $row['date']

		$marker = array(
			'type' => 'Feature',
			'geometry' => array(
				'type' => 'Point',
				'coordinates' => $coords
			),
			'properties' => array(
				'description' => $story,
				'tag' => $row['tag'],
				'date' => $row['dt'],
				'ref' => $row['ref'],
				'icon' => 'marker'
			)
		);

		array_push($geojson['features'], $marker);
	}


	/*while ($ref = $results->fetch_assoc()) {
		$json_results[] = $ref;
	}*/
	
	echo json_encode($geojson, 128);
	//print_r($json_results);
?>