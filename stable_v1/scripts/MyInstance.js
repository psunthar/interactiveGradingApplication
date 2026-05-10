function MyInstance(){
	
	/*******************************************************************
	 * 						Data members								
	 * ****************************************************************/
	 //user inputs......................................................
	this.Data=[];
	this.dataFrequency=[];
	this.maxPossible=100;
	this.gradeMode="iitbAbsolute";
	
	//variables in all modes............................................
	this.gradeCount;
	this.gradeLabels=[];
	this.gradeCredits=[];
	
	//iitb Default variables............................................
	this.refValue;
	
	
	//custom model variables............................................
	this.maxData=100;
	this.minData=0;
	this.min;
	this.max;
	
	
	//flag
	this.hasData=0;
	
	
	//other variables
	this.yMax;
	this.average;
	this.myChart=null;
	this.myAnnotationsFixed=[];
	this.myAnnotationsMovable=[];
	this.myAnnotations=[];
	this.gradeValuesMovable=[];
	this.gradeValuesFixed=[];
	this.gradeFrequencyDynamic=[];
	this.gradeFrequencyStatic=[];
	this.chartBg='#7F7F7F';
	this.chartType="line";
	
	
	this.pie1=null;
	this.pie2=null;

}	

/*******************************************************************************************************************************************
 * 																	
 * 																Methods
 * 										
 *******************************************************************************************************************************************/
	 
	 /**************************************************************************************************************************************
	  * 														Tab1 Methods								
	  * ***********************************************************************************************************************************/
MyInstance.prototype={
	constructor:MyInstance,
	
	
	//confirm input data by user and set variables to new values........
	
	 confirmData:function (){
		 var k=this.setData();
		 console.log("k is found ");
		 if(k==0){
			 alert("Invalid Data for plotting");
			 return;
			 }
		 else if(this.Data.length>0){
		 	//clear any existing chart..................................
		 	if(this.myChart!=null){
						this.myChart.destroy();
						this.myChart=null;
						//alert("chart destroyed");
						}
			this.gradeMode=document.getElementById('gradingModel').value;
			/*this.maxPossible=parseFloat(document.getElementById("maxPossible").value);
						if(isNaN(this.maxPossible)){
							alert("Maximum marks should be a number!!!\n Check input");
							document.getElementById("maxPossible").focus();
							}
				*/
		 //confirm variables of iitb default mode.......................
			
			if(this.gradeMode == "iitbDefault"){				
				
				console.log("control is in confirm data iitbDefault mode");
				/********************************************************
				*--dd[=rValue*0.4]--|--cd--|--cc--|--bc--|--bb--|--ab--|--aa--|rValue|--ap--
				*
				********************************************************/
				this.refValue=parseFloat(document.getElementById('iitbDefaultRefValue').value);
				console.log("reference value is "+this.refValue);
				if(isNaN(this.refValue)){
					alert("Invalid or missing input!!! \nCheck value of upper bound of 'AA' grade!!!");
					this.hasData=0;
					return;
					}
				else if(this.refValue<10){
					alert("Reference value too small!!!");
					this.hasData=0;
					return;
					}
				this.gradeCount=9;
				this.gradeLabels=["FR","DD","CD","CC","BC","BB","AB","AA","AP"];
				this.gradeCredits=[0,4,5,6,7,8,9,10,10];
				var delta=(this.refValue-(this.refValue*0.4))/7;
				var least=(this.refValue*0.4);
				console.log("grade count = "+this.gradeCount+" ref value= "+this.refValue+" delta "+ delta+" least = "+least );
				this.gradeValuesFixed=[];
				this.gradeValuesMovable=[];
				

				//calculate bounds.......................
				for(var i=0;i<this.gradeCount-1;i++){
					this.gradeValuesFixed[i]=Math.floor(least+(i*delta));
					this.gradeValuesMovable[i]=Math.floor(least+(i*delta));
					}
				
				console.log(" grade values from calculation is "+this.gradeValuesFixed);			
				
				this.hasData=1;
			
			
				}
			//end of iitb default mode code.................................
				
			//confirm variables of absolute mode ...........................
			else if(this.gradeMode=="iitbAbsolute"){
				
				console.log("control is in confirm data iitbAbsolute mode");
				this.gradeCount=9;
				this.gradeLabels=["FR","DD","CD","CC","BC","BB","AB","AA","AP"];
				this.gradeCredits=[0,4,5,6,7,8,9,10,10];			
				this.gradeValuesFixed=[30,40,50,60,70,80,90,100];
				this.gradeValuesMovable=[30,40,50,60,70,80,90,100];
				this.hasData=1;

			
				}
			//end of iitb absolute mode code...................................

				
			//confirm variables of custom mode..............................
			else if(this.gradeMode=="custom"){
					 				
						console.log("control is in confirm data custom mode");
						//fetch value of maximum which is upper bound in partitioning grades.(may not be the large value in graph)
						this.max=parseInt(document.getElementById("max").value);
						if(isNaN(this.max)){
							alert("Upper bound is not a number!!!check input");
							document.getElementById("max").focus();
							this.hasData=0;
							return;
							}
						//fetch value of minimum which is lower bound in partitioning grades.(may not be the least value in graph)
						this.min=parseInt(document.getElementById("min").value);
						if(isNaN(this.min)){	
							alert("Lower bound is not a number, check input");
							document.getElementById("min").focus();
							this.hasData=0;
							return;
							}
						else if(this.min>=this.max){
							alert("Lower bound should be less than upper bound");
							this.hasData=0;
							return;
							}
						//fetch number of grades to partition 	
						this.gradeCount=parseInt(document.getElementById("gradeCount").value);
						if(isNaN(this.gradeCount)){
							alert("Number of Grades should be a number. Check input");
							document.getElementById("gradeCount").focus();
							}
						//fetch resolution which would be the minimum unit in x-axis
						//fetch labels and credits from user........................
						this.gradeLabels=[];
						this.gradeCredits=[];
						console.log("grade count is "+this.gradeCount);
						for(var i=0;i<this.gradeCount;i++){
								var lId="g"+(parseInt(i)+1)+"L";
								var vId="g"+(parseInt(i)+1)+"V";
								console.log("picking label from id : "+lId);
								this.gradeLabels[i]=document.getElementById(lId).value.trim();
								if(this.gradeLabels[i]=="" || this.gradeLabels[i]==""){
									alert("Grade Label "+parseInt(i+1)+" is not valid!!!");
									this.hasData=0;
									return;
									}
								console.log(	this.gradeLabels[i]   );			
						
								console.log("picking credit value from id : "+vId);
								this.gradeCredits[i]=parseFloat(document.getElementById(vId).value);
								if(isNaN(this.gradeCredits[i])){
									alert("Grade credit "+parseInt(i+1)+" is not a number!!!");
									this.hasData=0;
									return;
									}
							}	
						this.gradeCredits.unshift(0);
						this.gradeLabels.unshift("FR");
						this.gradeCount++;
						//clear grade bound lists before computing.................................
						this.gradeValuesMovable=[];
						this.gradeValuesFixed=[];
						var delta=( (this.max-this.min) / this.gradeCount+1 );
						for(var i=0;i<this.gradeCount;i++){
								this.gradeValuesMovable[i]=Math.round(this.min+(delta*(i+1)));
								this.gradeValuesFixed[i]=Math.round(this.min+(delta*(i+1)));
							}
						
						console.log("grade values are "+this.gradeValuesFixed+" delta is "+ delta);
						//validation of all inputs is done. Report to user the same......
						
						this.hasData=1;
					
							
						console.log("Min is set to "+this.min+"\n Max is "+this.max+"\n Grade count=="+this.gradeCount);
						console.log("Grade Labels are "+this.gradeLabels+"\nGrade Credits: "+this.gradeCredits);
				}
				
			//end of custom mode code....................................
				
			//grade mode custom 2 starts....................................	
				else if(this.gradeMode=="custom2"){
					 
						console.log("control is in confirm data custom2 mode");
						//fetch number of grades to partition 	
						this.gradeCount=parseInt(document.getElementById("c2gradeCount").value);
						if(isNaN(this.gradeCount)){
							alert("Number of Grades should be a number. Check input"+this.gradeCount);
							document.getElementById("c2gradeCount").focus();
							this.hasData=0;
							return;
							}
						
						//fetch resolution which would be the minimum unit in x-axis
						//fetch labels and credits from user........................
						this.gradeLabels=[];
						this.gradeCredits=[];
						this.gradeValuesMovable=[];
						this.gradeValuesFixed=[];
						for(var i=0;i<this.gradeCount;i++){
								var lId="c2g"+(parseInt(i)+1)+"L";
								var vId="c2g"+(parseInt(i)+1)+"V";
								var bId="c2g"+(parseInt(i)+1)+"B";
							
								this.gradeLabels[i]=document.getElementById(lId).value;
								if(this.gradeLabels[i]=="" || this.gradeLabels[i]==""){
									alert("Grade Label "+parseInt(i+1)+" is not valid!!!");
									this.hasData=0;
									return;
									}
								console.log("picking from (g/c/b)-id : "+vId);
								this.gradeCredits[i]=parseInt(document.getElementById(vId).value);
								if(isNaN(this.gradeCredits[i])){
									alert("Grade credit "+parseInt(i+1)+" is not a number");
									this.hasData=0;
									return;
									}
								this.gradeValuesMovable[i]=parseInt(document.getElementById(bId).value);
								if(isNaN(this.gradeValuesMovable[i])){
									alert("Grade Bound "+parseInt(i+1)+" is not a number");
									this.hasData=0;
									return;
									}
								this.gradeValuesFixed[i]=parseInt(document.getElementById(bId).value);
								if(i>0 && this.gradeValuesFixed[i]<=this.gradeValuesFixed[i-1]){
									alert("Input grades starting from lowest to highest in ascending order");
									this.hasData=0;
									return;
									}
							}	
						this.gradeCredits.unshift(0);
						this.gradeLabels.unshift("FR");
						this.gradeCount++;
						//validation of all inputs and report to user the same......
						//check once for any non validated variables before confirming	
						
						this.hasData=1;
					
								
						console.log("Grade Labels are "+this.gradeLabels+"\nGrade Credits: "+this.gradeCredits);
					}
				}
		
		},
	 /*******************************************************************
	  * 						end of confirm data method
	  * ****************************************************************/
	 
	  setData:function(){
		inputBox=document.getElementById("dataField");
		if(inputBox.value==null && inputBox.value==""){
			return 0;
			}
		else if(inputBox.value!=null && inputBox.value!=""){
			var tempData;
			tempData=inputBox.value;
			tempData=tempData.trim();
			tempData=tempData.split('\n');
			for(var i=0;i<tempData.length;i++){
				tempData[i]=parseFloat(tempData[i]);
				//tempData[i]=Math.round(tempData[i]);
				if(isNaN(tempData[i])){				
					tempData.splice(i,1);
					return 0;
					}	
				}
				
			console.log("Data is validated"+tempData);
			this.Data=tempData;
			var total=0;
			this.maxData=-Infinity;
			this.minData=Infinity;
			//calculating average of whole data provided by user
			for(var i=0;i<this.Data.length;i++){
					total+=parseFloat(this.Data[i]);
					if(this.Data[i]>this.maxData)
						this.maxData=this.Data[i];
					if(this.Data[i]<this.minData)
						this.minData=this.Data[i];
				}
			this.maxPossible=105;
			if(this.maxData>this.maxPossible){
				this.maxPossible=Math.ceil(this.maxData*1.1);
				}
			console.log("printing average from next")	
			this.average=total/parseFloat(this.Data.length);
			console.log("Average = "+this.average)
			document.getElementById("avgMarks").innerHTML=this.average.toFixed(3);
			document.getElementById("dataCount").innerHTML=this.Data.length;
		}
		return 1;
	 },
	 //end of method sed data...........................................
	 
	 /*************************************************************************************************************************************
	  * 														Tab2 methods 								
	  * ***********************************************************************************************************************************/
	  
		plotData:function() {
	  		console.log("Plotting user data");
			var ctx = document.getElementById("myChart").getContext("2d");
				//set height and width of canvas........................
				ctx.canvas.width = window.innerWidth*0.9;
				ctx.canvas.height = window.innerHeight*0.8;
				ctx.canvas.parentNode.style.width = window.innerWidth*0.9;
				ctx.canvas.parentNode.style.height = window.innerHeight*0.5;



			var labels=[];
			//create labels based on resolution and max value on x......	
			for(var i=0;i<this.maxPossible+1;i++){
				labels[i]=i;
				}
			
			var arrangedData=this.Data.slice();
			arrangedData.sort();
			console.log("arranged Data :"+arrangedData+"\n labels are:"+labels);
			this.dataFrequency=[];
			for(var i=0;i<this.maxPossible+1;i++)
				this.dataFrequency[i]=0;
				
			console.log("this is freq:"+this.dataFrequency);
			this.yMax=0;
			for(var i=0;i<arrangedData.length;i++){
					this.dataFrequency[Math.round(arrangedData[i])%(this.maxPossible+1)]++;
					if(this.dataFrequency[Math.round(arrangedData[i])%(this.maxPossible+1)] > this.yMax)
						this.yMax=this.dataFrequency[Math.round(arrangedData[i])%(this.maxPossible+1)];					
			}
			
			
			
			
			
			//make annotations which are static and label them...	
			console.log(""+this.gradeValuesFixed)
			this.myAnnotationsFixed=[];
			this.myAnnotationsMovable=[];
			for(var i=0;i<(this.gradeCount-1);i++) {
				this.myAnnotationsFixed[i]=this.makeAnnotation(this.gradeValuesFixed[i],this.gradeLabels[i+1],false,"#F15454",5,i);
			}
			
			//make annotations which are dynamic and label them...
			for(var i=0;i<(this.gradeCount-1);i++) {
				this.myAnnotationsMovable[i]=this.makeAnnotation(this.gradeValuesMovable[i],this.gradeLabels[i+1],true,"#008000",7,i);
			}
			

			this.myAnnotations=this.myAnnotationsFixed.concat(this.myAnnotationsMovable);
			
			var Lboxes=document.getElementsByClassName("curLabels");
			var Vboxes=document.getElementsByClassName("curVals");
			
			for(var i=0;i<this.gradeLabels.length-1;i++){
				Lboxes[i].style.display="inline-block";
				Vboxes[i].style.display="inline-block";
				Lboxes[i].innerHTML=this.gradeLabels[i+1]+":";
				Vboxes[i].value=parseInt(this.gradeValuesMovable[i]);
				}
			for(var i=this.gradeLabels.length-1;i<10;i++){
				Lboxes[i].style.display="none";
				Vboxes[i].style.display="none";
				}
				
			//build x-axis gridline color/width arrays: bold line at even marks, faint at odd
			var xGridColors=[];
			var xGridWidths=[];
			for(var i=0;i<labels.length;i++){
				if(i%2===0){
					xGridColors.push('rgba(0,0,0,0.18)');
					xGridWidths.push(1);
				}else{
					xGridColors.push('rgba(0,0,0,0.05)');
					xGridWidths.push(0.5);
				}
			}

			//this.chartBg=prompt("Enter color");
			this.myChart = new Chart(ctx, {
						type:this.chartType,
						data:  {
							labels: labels,
							datasets: [{
								fill:'origin',
								label: 	'Frequency.',
								data:	this.dataFrequency,
								backgroundColor:this.chartBg,
								borderWidth:	1,
								lineTension:0.5
							}]
						},
						options: {     responsive:false,
									   title: {        display: true    },
									  scales: {
										xAxes: [{
											id:'x-axis-0',
											ticks: {
												autoSkip:false,
												maxRotation:0,
												minRotation:0,
												callback:function(value,index){
													return (index%2===0)?value:'';
												}
											},
											gridLines: {
												display:true,
												drawTicks:true,
												tickMarkLength:5,
												color:xGridColors,
												lineWidth:xGridWidths
											}
										}],
										yAxes: [{suggestedMax: this.yMax+5,position: 'left',gridLines: {zeroLineColor: "rgba(0,255,0,1)"}, scaleLabel: {display: true,labelString: 'Frequency'},ticks: { beginAtZero:true, min: 0, max:this.yMax+2 } 		}]
									} ,
								  annotation: {
												events: ['drag'],
												annotations:this.myAnnotations
											},
							pan: {
								enabled: true,
								mode: 'x'
							},
							zoom: { 
								enabled: true,
								mode: 'x',
								limits: {
									max: 2,
									min: 1
								}
							}
						}

					});

			this.getStats();
			this.refreshFreqStrip();

				  },
				  /*****************************************************
				   * 				end of method plot
				   * ****************************************************/
					updateGrades:function(e,newVal,index){
						console.log("in update grades function"+newVal+" index "+index);
						var val=parseInt(newVal);
						var i=parseInt(index);
						if(i==0){
							if(val>=this.myAnnotationsMovable[1].value){
									this.myAnnotationsMovable[0].value=this.myAnnotationsMovable[1].value-1;
									e.value=this.myAnnotationsMovable[1].value-1;
								}
							else{	
								this.gradeValuesMovable[parseInt(index)]=parseFloat(newVal);
								this.myAnnotationsMovable[parseInt(index)].value=parseInt(newVal);
								}
							}
						else if(i>0 && i<this.myAnnotationsMovable.length-1){
							if(val>=this.myAnnotationsMovable[i+1].value){
								this.myAnnotationsMovable[i].value=this.myAnnotationsMovable[i+1].value-1;
								e.value=this.myAnnotationsMovable[i+1].value-1;
								}
							else if(val<=this.myAnnotationsMovable[i-1].value){
								this.myAnnotationsMovable[i].value=this.myAnnotationsMovable[i-1].value+1;
								e.value=this.myAnnotationsMovable[i-1].value+1
								
								}
							else{
								this.gradeValuesMovable[parseInt(index)]=parseFloat(newVal);
								e.value=this.myAnnotationsMovable[parseInt(index)].value=parseInt(newVal);
								}
							}
						else if(i==this.myAnnotationsMovable.length-1){
							if(val<=this.myAnnotationsMovable[i-1].value){
									this.myAnnotationsMovable[i].value=this.myAnnotationsMovable[i-1].value+1
									e.value=this.myAnnotationsMovable[i-1].value+1;
								}
							else{
								this.gradeValuesMovable[parseInt(index)]=parseFloat(newVal);
								this.myAnnotationsMovable[parseInt(index)].value=parseInt(newVal);
								}
							}

						this.getStats();
						this.refreshFreqStrip();
						this.myChart.update()
						},
					
					
					validateBarMovement:function(bar){
								console.log(bar);
								var cPos,cPosRight,cPosLeft;
								var index=bar.subject.config.pos;
								console.log(index);
								//for begining
									if(index==0){
										cPosRight=parseInt(this.gradeValuesMovable[index+1]);
										cPosLeft=-Infinity;
										}
									else if(index==(this.gradeValuesMovable.length-1)) {
										cPosRight=Infinity;
										cPosLeft=parseInt(this.gradeValuesMovable[index-1]);
										}
									else {
										cPosRight=parseInt(this.gradeValuesMovable[index+1]);
										cPosLeft=parseInt(this.gradeValuesMovable[index-1]);
										}
									var cPos=parseInt(this.gradeValuesMovable[index]);
									if(cPos>=cPosRight){
										cPos=cPosRight-1;
										bar.subject.config.value=cPos;
										}
									else if(cPos<=cPosLeft){
										cPos=cPosLeft+1;	
										bar.subject.config.value=cPos;
										}
						
						},
					/****************************************************
					 * 						end of validate method
					 * **************************************************/
		
			
		 makeAnnotation:function (val,text,dragFlag,brdrColor,brdrWidth,index){
					console.log("inside make annot. vla:"+val+" text:"+text+" dragFlag:"+dragFlag+" index:"+index) 
					var annot;
					if(brdrColor==null)
						brdrColor='#'+Math.floor(Math.random()*16777215).toString(16);
					if(brdrWidth==null)
						brdrWidth=Math.ceil(Math.random()*5);
					if(dragFlag==true)
						text="\u22B2"+text+"\u22B3";
					return  annot = {
							pos:index,
							type: 'line',
							mode: 'vertical',
							scaleID: 'x-axis-0',
							value: val,
							borderColor:brdrColor,
							borderWidth: brdrWidth,
							label: {
								enabled: true,
								content: text,
									},
							draggable: dragFlag,
							
							onDragStart: function(e) {
								console.log(e.type, e.subject.config.value);
									},
							
							onDrag: function(e) {
								console.log("you are dragging this to: "+e, e.subject.config.value);	
									},
							
							onDragEnd: function(e) {
								console.log(e.type,e, e.subject.config.value);
								//recompute statistics and position after drag end
								//begin validating drag movement........
								obj.validateBarMovement(e);
								obj.getStats();

								var Lboxes=document.getElementsByClassName("curLabels");
								var Vboxes=document.getElementsByClassName("curVals");
								for(var i=0;i<obj.gradeLabels.length-1;i++){
									Lboxes[i].style.display="inline-block";
									Vboxes[i].style.display="inline-block";
									Lboxes[i].innerHTML=obj.gradeLabels[i+1]+":";
									Vboxes[i].value=parseInt(obj.gradeValuesMovable[i]);
									}
								for(var i=obj.gradeLabels.length-1;i<10;i++){
									Lboxes[i].style.display="none";
									Vboxes[i].style.display="none";
									}

								obj.refreshFreqStrip();
								obj.myChart.update();
								console.log("chart updated");
								//end of validate drag......................

								},
							onClick: function(e) {
									console.log("clicked on annotation!!! Nothing to do");
									}
								}	
						},
				/*******************************************************
				 * 					end of method make annotation
				 * *****************************************************/

		refreshFreqStrip:function(){
			var FreqLabels=document.getElementsByClassName("freqLabels");
			var FreqVals=document.getElementsByClassName("freqVals");
			var PctVals=document.getElementsByClassName("pctVals");
			var total=this.Data.length;
			var freqSum=0;
			var pctSum=0;
			for(var i=0;i<this.gradeLabels.length;i++){
				FreqLabels[i].style.display="inline-block";
				FreqVals[i].style.display="inline-block";
				PctVals[i].style.display="inline-block";
				FreqLabels[i].innerHTML=this.gradeLabels[i];
				var f=this.gradeFrequencyDynamic[i];
				if(f==null) f=0;
				FreqVals[i].innerHTML=f;
				freqSum+=f;
				var pct=total>0 ? (f/total*100) : 0;
				PctVals[i].innerHTML=pct.toFixed(1)+"%";
				pctSum+=pct;
			}
			for(var i=this.gradeLabels.length;i<FreqLabels.length;i++){
				FreqLabels[i].style.display="none";
				FreqVals[i].style.display="none";
				PctVals[i].style.display="none";
			}
			var totalVal=document.getElementsByClassName("freqTotalVal")[0];
			var totalPct=document.getElementsByClassName("freqTotalPct")[0];
			if(totalVal) totalVal.innerHTML=freqSum;
			if(totalPct) totalPct.innerHTML=pctSum.toFixed(1)+"%";
		},

	/***************************************************************************************************************************************
	*
	* 															Tab3 methods
	*
	* *************************************************************************************************************************************/

		getStats:function (){
			console.log("calling get statistics function with grade values fixed = "+ this.gradeValuesFixed);
			this.gradeValuesMovable=[];
			for(var i=0;i<this.myAnnotationsMovable.length;i++){
				this.gradeValuesMovable[i]=this.myAnnotationsMovable[i].value;
				this.gradeValuesMovable[i]=this.gradeValuesMovable[i];
			}
			console.log(this.gradeValuesMovable);
			//Get frequency distibution of students in each partition of grade...............
			this.gradeFrequencyDynamic=this.getGradeFrequency(this.gradeValuesMovable);
			this.gradeFrequencyStatic=this.getGradeFrequency(this.gradeValuesFixed);
			console.log("Dynamic Grade Bounds: "+this.gradeFrequencyDynamic);
			console.log("Static Grade Bounds: "+this.gradeFrequencyStatic);
			console.log("Static values movable: "+this.gradeValuesMovable);
			console.log("Static values fixed: "+this.gradeValuesFixed);
			
		},
		
		


		showPieStats:function(){
			var pie1Ctx=document.getElementById("pie1").getContext("2d");
			var pie2Ctx=document.getElementById("pie2").getContext("2d");
				pie1Ctx.canvas.width = document.getElementById("pieStats").width*0.4;
				pie1Ctx.canvas.height =document.getElementById("pieStats").height*0.5;
				pie2Ctx.canvas.width = document.getElementById("pieStats").width*0.4;
				pie2Ctx.canvas.height = document.getElementById("pieStats").height*0.5;
				pie1Ctx.canvas.parentNode.style.height = '464px';
				pie2Ctx.canvas.parentNode.style.height = '464px';
				pie1Ctx.canvas.parentNode.style.width = window.innerWidth*0.45;
				pie2Ctx.canvas.parentNode.style.width = window.innerWidth*0.45;
			var myColors=['#A52A2A','#7373A8','#FB46DA','#D971D9','#DEDE2D','#FF0000','#90EE90','#FFA500','#7F7F7F','#1E90FF','#008000'];
			var bg=[];
			for(var i=0;i<this.gradeLabels.length;i++){
				bg[i]=myColors[i];//'#'+Math.floor(Math.random()*16777215).toString(16);
				}
			this.pie1 = new Chart(pie1Ctx, {
						responsive:false,
						maintainAspectRatio:false,
						type:"pie",
						data:  {
							labels: this.gradeLabels,
							datasets: [{
								data:	this.gradeFrequencyStatic,
								backgroundColor:bg
							}]
						},
						options: {
							title: {        display: true  ,text:'Default Stats'  },
							legend:{
								position:'left'
								},
							zoom:{
								enabled:false
								}
							}
							
					});		
						
			this.pie2 = new Chart(pie2Ctx, {
						responsive:false,
						maintainAspectRatio:false,
						type:"pie",
						data:  {
							labels: this.gradeLabels,
							datasets: [{
								label: 	'New Stats',
								data:	this.gradeFrequencyDynamic,
								backgroundColor:bg
							}]
						},
						options: {
							title: {        display: true  ,text:'New Stats'  },
							legend:{
								position:'left'
								},
							zoom:{
								enabled:false
								}
							}	
					});			

			},
		
		showStats:function (){
			
			
			//Place data in table.......................................
			var tableRows=document.getElementsByClassName("statsTableRows");
			console.log("Number of table rows are "+tableRows.length);
			console.log("Grade labels is "+this.gradeLabels);
			
			this.gradeValuesFixed.unshift(-Infinity);
			this.gradeValuesFixed[this.gradeValuesFixed.length]=Infinity;
			
			this.gradeValuesMovable.unshift(-Infinity);
			this.gradeValuesMovable[this.gradeValuesMovable.length]=Infinity

			for(var i=0;i<this.gradeCount;i++){
				var tableRow=tableRows[i].children;
				console.log(tableRow);
				console.log("this row is having "+tableRow.length+" no of td");
				tableRow[4].style.background = tableRow[0].style.background = tableRow[1].style.background = tableRow[2].style.background = tableRow[3].style.background = "#E5E5E5";
				tableRow[4].style.color = tableRow[0].style.color = tableRow[1].style.color = tableRow[2].style.color = tableRow[3].style.color = "#D45050";

				tableRow[5].style.color = tableRow[6].style.color = tableRow[7].style.color = "#008000";

				tableRow[0].innerHTML=(this.gradeLabels[i]);
				tableRow[1].innerHTML=(this.gradeCredits[i]);
				tableRow[2].innerHTML=(this.gradeValuesFixed[i]);
				tableRow[3].innerHTML=(this.gradeValuesFixed[i+1]);
				tableRow[4].innerHTML=(this.gradeFrequencyStatic[i]);
				tableRow[5].innerHTML=(this.gradeValuesMovable[i]);
				tableRow[6].innerHTML=(this.gradeValuesMovable[i+1]);
				tableRow[7].innerHTML=(this.gradeFrequencyDynamic[i]);		
				}
		
			for(var i=this.gradeCount;i<tableRows.length;i++){
				tableRows[i].style.display="none";
				}
			var avgTable=document.getElementsByClassName("avgTable")[0].children;
				avgTable[0].innerHTML="Total";
				avgTable[1].innerHTML=this.Data.length;
				avgTable[1].style.color="#4d4d4d";
				avgTable[1].style.fontWeight="bold";
				avgTable[3].innerHTML="Average GPA";
				avgTable[4].innerHTML=this.getAverageGPA(this.gradeFrequencyStatic);
				avgTable[4].style.color="red";
				avgTable[6].innerHTML="New Average GPA";
				avgTable[7].innerHTML=this.getAverageGPA(this.gradeFrequencyDynamic);
				avgTable[7].style.color="green";
			
			this.gradeValuesFixed.shift();
			this.gradeValuesFixed.pop();;
			
			this.gradeValuesMovable.shift();
			this.gradeValuesMovable.pop();
	
			},
			


		getGradeFrequency:function (positions){
			  var result=[];
			  var min=-Infinity;
			  var dataSet=this.Data.slice();
			  dataSet.sort(function(a,b){return a-b;});
			  var index=0;
			  var cumSum=0;
			  for(var i=0;i<positions.length;i++){
				var maxLimit=positions[i];
				var sum=0;
				for(var j=index;j<dataSet.length;j++){
				  var v=Math.round(dataSet[j]);
				  if(v>=min && v<maxLimit){
					sum++;
					cumSum++;
				  }
				  else{
					break;
				  }
				}
					min=positions[i];
					index=index+sum;
				result.push(sum);
			  }
			  result.push(dataSet.length-cumSum);
			  return result;
			},
			    
					
		getAverageGPA:function (gradeDist){
			console.log(" grade dist :"+gradeDist);
			console.log("calculating averagae GPA");
			var student_count=0,
				wsum=0;
			for(var i=0;i<gradeDist.length;i++){
				console.log("weight is now "+this.gradeCredits[i]);
				student_count+=gradeDist[i];
				console.log("student count is now "+student_count);
				wsum+=this.gradeCredits[i]*gradeDist[i];
				console.log("weighted sum is now "+wsum);
				}
			
			console.log((wsum/student_count).toFixed(3));
			return (wsum/student_count).toFixed(3);
		},



		exportData:function(){
			  var a = document.getElementById("a");
			  var file = new Blob([this.Data], {type: 'text/plain'});
			  a.href = URL.createObjectURL(file);
			  a.download = Date()+"GradeData.txt";
			  a.click();
			
			}


}

