/***********************************************************************
 * 						Tab 1 functions											
 * *********************************************************************/
tab1();
function tab1() {
	console.log("inside tab1 function");
	document.getElementById("divInput").style.display="block";
	document.getElementById("divStat").style.display="none";
	document.getElementById("divExport").style.display="none";	
	}


function getData(event){
	if(event.value!=null && event.value!=""){
		var tempData;
		event=event || window.event;
		console.log("go to school");
		tempData=event.value;
		tempData=tempData.trim();
		tempData=tempData.split('\n');
		for(var i=0;i<tempData.length;i++){
			tempData[i]=parseFloat(tempData[i]);
			if(isNaN(tempData[i])){				
				tempData.splice(i,1);
				console.log("Invalid input!!!\nEnter only marks which are numbers.Data is of length :"+Data.length+" deleting :"+"new data is "+Data);
				}	
			}
		console.log("Data is validated :"+tempData);
		Data=tempData;
		var total=0.0,
			average=0.0;
		for(var i=0;i<Data.length;i++)
				total+=parseFloat(Data[i]);
			
			average=total/parseFloat(Data.length);
			document.getElementById("avgMarks").innerHTML=average.toFixed(3);
			document.getElementById("dataCount").innerHTML=Data.length;
			
		}
}


function confirmData(){
	var k=document.getElementById("dataField");
	getData(k);
	min=document.getElementById("min").value;
	max=document.getElementById("max").value;
	gradeCount=document.getElementById("gradeCount").value;
	resolution=parseInt(document.getElementById("resolution").value);
	if(isNaN(min) || isNaN(max) || isNaN(gradeCount)){
		alert("Invalid input!!!");
		min=null;
		max=null
		gradeCount=null;
		}
	else {
		gradeLabels=[];
		gradeValues=[]
		for(var i=0;i<=gradeCount;i++){
				var lId="g"+(i+1)+"L";
				var vId="g"+(i+1)+"V";
				console.log("picking label from id : "+vId);
				gradeCredits[i]=document.getElementById(vId).value;
				if(i==gradeCount)
					break;
				console.log("picking label from id : "+lId);
				gradeLabels[i]=document.getElementById(lId).value;
				//gradeLabels.reverse();
				console.log(	gradeLabels[i]   );			
			}
		}
	console.log("min is now "+min+" and max is "+max+" grade count=="+gradeCount);

}


