<?php
/**
 * Php file to simulate the server-side communication for the countries API.
 * 
 */
 header('Content-Type: application/json');

 if (array_key_exists('str', $_POST) && array_key_exists('typ', $_POST)){
    $str = $_POST['str'];
    $typ = $_POST['typ'];

    $url = "https://restcountries.eu/rest/v2/";
    
    if ($typ == "Name") {
	    $url = $url . "name/" . $str;}
    
    elseif ($typ == "Code") {
	    $url = $url . "alpha/" . $str;
    }

    $json = @file_get_contents($url);
    if ($json===FALSE){
        exit("No results found for given input.");
    }else{
    $json_data = json_decode($json,  true);

    echo $json;
    }

} else{
    exit("Unexpected or missing variables sent to server.");
 }
 
    
?>