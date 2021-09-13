//author: Adam Elliott
//Routine to handle the code changes for the countries api search function

/**
 * main function for the api search. Handles sending and processing whatever is recieved from the server.
 */
function search() {
    const results=document.getElementById("resultsBox");
    
    searchString = document.getElementById("searchBar").value;
    searchType = document.querySelector('input[name="searchType"]:checked').value;

    // save some resources if nothing is entered in the search bar
    if(searchString.length==0){
        results.innerHTML="<br>A blank search won't give any results.";
        document.getElementById("subregions").innerHTML="";
        document.getElementById("regions").innerHTML="";
        document.getElementById("counter").innerHTML="";
        return;
    }

    var xhttp = new XMLHttpRequest();

    /**
     * Function for handling the response.
    */
    xhttp.onreadystatechange  = function () {

        const regionArray = new Map();
        const subregionArray = new Map();

        if(!(this.responseText[0] == '[' || this.responseText[0] == '{' )){
            results.innerHTML = this.responseText;
        }

        let dataArr = JSON.parse(this.responseText);
        
        // Need to handle the 'code' case seprately as it returns shallow JSON info for a single country rather than an array.
        // This could be handled by inserting the returned data into an empty array instead. 
        if (searchType=="Code"){
            resultCount=1;

            let node = document.createElement("div");
            node.className="resultsGrid";
            node.id="results"+0;
           

            let body=document.createElement("body");
            
            body.innerHTML+="<h1> "+ dataArr.name +" </h1>";
            body.innerHTML+="<img class='flag' src='"+ dataArr.flag+"' transform='scale(.01)'  />";
            body.innerHTML+="<br><div class='tooltip'> Country Codes: "+dataArr.alpha2Code+"/"+dataArr.alpha3Code+"<span class='tooltiptext'>alpha-2/alpha-3 codes from ISO 3166</span></div><br>";
            body.innerHTML+="<p> Population: " + (dataArr.population).toLocaleString();
            body.innerHTML+="<br>Region: " + dataArr.region +"<br> Subregion: "+ dataArr.subregion +"</p>";
            
            //keep a running total for the region counts
            regionArray.set(dataArr.region,(regionArray.get(dataArr.region)|| 0)+1);
            subregionArray.set(dataArr.subregion,(subregionArray.get(dataArr.subregion)|| 0)+1);

            let langStr="<p>Languages: </p><table><tr>"
            for(y in dataArr.languages){
                langStr+="<td >" + dataArr.languages[y].name +"</td>"
            }
            body.innerHTML+=langStr

            node.appendChild(body);

            results.appendChild(node);
        }
        else{ 
            resultCount=dataArr.length;

            for (x in dataArr){
                let node = document.createElement("div");
                node.className="resultsGrid";
                node.id="results"+x;

                //populating the grid node for each country. There is definiely a nicer looking way to do this.
                let body=document.createElement("body");
                
                body.innerHTML+="<h1> "+ dataArr[x].name +" </h1>";
                body.innerHTML+="<img class='flag' src='"+ dataArr[x].flag+"' transform='scale(.01)'  />";
                body.innerHTML+="<br><div class='tooltip'> Country Codes: "+dataArr[x].alpha2Code+"/"+dataArr[x].alpha3Code+"<span class='tooltiptext'>alpha-2/alpha-3 codes from ISO 3166</span></div><br>";
                body.innerHTML+="<p> Population: " + (dataArr[x].population).toLocaleString();
                node.population=dataArr[x].population; //add a value to the node object 
                body.innerHTML+="<br>Region: " + dataArr[x].region +"<br> Subregion: "+ dataArr[x].subregion +"</p>";

                regionArray.set(dataArr[x].region,(regionArray.get(dataArr[x].region)|| 0)+1);
                subregionArray.set(dataArr[x].subregion,(subregionArray.get(dataArr[x].subregion)|| 0)+1);

                let langStr="<p>Languages: </p><table><tr>";
                for(y in dataArr[x].languages){
                    langStr+="<td >" + dataArr[x].languages[y].name +"</td>";
                }
                body.innerHTML+=langStr;


                node.appendChild(body);

                //"sorting " the nodes by inserting the new country in the correct place
                for(var child=results.firstChild; child!==null; child=child.nextSibling) {
                    if(dataArr[x].population > child.population){
                        break;
                    }
                };
                
                results.insertBefore(node,child);
            
            };
        }
        //display the counter
        document.getElementById("counter").innerHTML="<br><strong> " + resultCount + " Countries Found</strong>";

        //display the region counts
        var regionStr="<br><strong>Regions:</strong>";
        regionArray.forEach (function(value, key) {
            regionStr += "<br>" + key + ': ' + value + "";
          })
        document.getElementById("regions").innerHTML=regionStr;
        
        //display the subregion counts
        var regionStr="<strong>Sub Regions:</strong>";
        subregionArray.forEach (function(value, key) {
            regionStr += "<br>" + key + ': ' + value + "";
          })
        document.getElementById("subregions").innerHTML=regionStr;

    }
    xhttp.open("POST", "http://localhost:8765/api/index.php", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("str=" + searchString + "&typ="+ searchType);
    
    xhttp.send();
}
