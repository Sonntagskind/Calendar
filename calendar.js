function createCalendar( id, year, month, today ) {
    var weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var monthName = ['January', 'February', 'March', 'April', 'May', 
                 'June', 'July', 'August', 'September', 
                 'October', 'November', 'December'];

    var date = new Date( year, month );    

    var dayCount = ( new Date(year, month + 1, 0) ).getDate();

    var dayNum = 0 - ( date.getDay() == 0 ? 7 : date.getDay() );

    var parent = document.getElementById(id);

    parent.innerHTML = " ";

    var table = document.createElement('table');

    var tr = document.createElement('tr');

    //Previous month
    var previous = document.getElementById("previous");

    previous.setAttribute('onclick', 'createCalendar( "cal", ' + year + ', ' + (month - 1) + ')' );

    previous.addEventListener('click', function() {

      document.getElementById('addevent').style.display = 'none';

    });


    //Month, year and current date
    var cell = monthName[date.getMonth()] + ' ' + date.getFullYear();

    elem = document.createElement('div');
    elem.appendChild(document.createTextNode(cell));   

    var cmonth = document.getElementById("currentmonth"); 

    cmonth.appendChild(elem);
    cmonth.innerHTML = cell;//currentmonth content

    var nowDay = document.getElementById("nowDay");

    nowDay.onclick = function() {

      var todayDate = new Date();

      createCalendar( "cal", todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() );//defines the current year, month and day 

    };

    //Following month
    var next = document.getElementById("next");

    next.setAttribute('onclick', 'createCalendar( "cal", ' + year + ', ' + (month + 1) + ')' );

    next.addEventListener('click', function() {

      document.getElementById('addevent').style.display = 'none';

    });

    //Calendar content
    for (var row = 0; dayNum < dayCount; row++) { // create a row if involves at least one day (e.g. useful for February 2010)
       if (dayNum == -7) {
          //if table row consists only of previous months days we delete them and...
          row--;
          anTr = document.createElement('tr');
          table.appendChild(anTr);
          table.deleteRow(0);

      }

      else {
        //otherwise we...
        var tr = document.createElement('tr');

        table.appendChild(tr);

      }

      for (var col = 0; col < 7; col++) {

        if (row == 0) { 

        //Top row
        days = weekDay[col];

        }  

          //Calendar body
          dayNum++;

          elem = document.createElement('td');

          if ((dayNum > 0) && (dayNum <= dayCount)) {

            elem.className = 'out';
            cell = dayNum;

          }

          if (dayNum == today) {
            elem.className += ' colorDay';

          }; 
          
           //Filling Data-attribute
           cell = (new Date(year, month, dayNum)).getDate();

           var mm = (new Date(year, month, dayNum).getMonth()+1),
               yyyy = (new Date(year, month, dayNum).getFullYear());

            markCell = cell + '-' + mm + '-' + yyyy;
            elem.setAttribute('data-cell', markCell);
            elem.className += " " + "searchable";
            elem.setAttribute('data-index', "");

        
        //Filling a cell of Calendar
        elem.appendChild(document.createTextNode(cell));
        tr.appendChild(elem); 

         if (row == 0) {

          elem.appendChild(document.createTextNode(', ' + days));

        }

      }

    };

    parent.appendChild(table);


    //Creating Div inside each cell
    var newTd = document.getElementsByTagName('td');

    for (var i=0; i<newTd.length; i++) {

      var spanEvent = document.createElement('span');
      newTd[i].appendChild(spanEvent);
      spanEvent.className = "spanEvent";


      var spanParticipants = document.createElement('span');
      newTd[i].appendChild(spanParticipants);
      spanParticipants.className = "spanParticipants";
      spanParticipants.setAttribute('data-participants', "spanParticipants");

      var spanDescription = document.createElement('span');
      newTd[i].appendChild(spanDescription);
      spanDescription.className = "spanDescription";
      spanDescription.setAttribute('data-description', "spanDescription");

      var theDiv = document.createElement('div');
      theDiv.innerHTML = "</br>" + " " + "</br>";
      newTd[i].appendChild(theDiv);

      theDiv.appendChild(spanEvent);
      theDiv.appendChild(spanParticipants);
      theDiv.appendChild(spanDescription);

    };


    //Check whether a stored Event exists
    if(localStorage.events) {

      var existEvents = JSON.parse(localStorage.getItem('events'));

        var checkCell = document.getElementsByTagName('td');
        for(n=0; n<checkCell.length; n++) {
        var compareCell = checkCell[n].getAttribute('data-cell');//Cells date Attribute

          for(i=0; i<existEvents.length; i++) {

            var item = existEvents[i];

              if(item.Date == compareCell) {

                //If cell Attribute equals the date 
                var showEvent = checkCell[n].querySelector('.spanEvent'),

                showParticipants = checkCell[n].querySelector('.spanParticipants'),
                showDescription = checkCell[n].querySelector('.spanDescription');

                //Show us stored data inside <span> elements in a cell
                showEvent.innerHTML = item.Event;
                showParticipants.innerHTML = item.Participants;
                showDescription.innerHTML = item.Description;

              };
            
          };
              
            
        }; 

    };


    //Creating Calendar Event
    var cells = document.querySelectorAll('.out');

    for (var i=0; i<cells.length; i++) {

        cells[i].addEventListener('click', function(e) {

          //Show the Event window
          var editEvent = document.getElementById('addevent');
          editEvent.style.cssText ='display: block;';
          this.style.position = 'relative';

          //If we've created an Event (Participants, Description) yet - you show us it
          var checkEvent = this.getElementsByClassName('spanEvent')[0];
          var checkParticipants = this.getElementsByClassName('spanParticipants')[0];
          var checkDescription = this.getElementsByClassName('spanDescription')[0];
  
          var windowEvent = document.getElementById('event'),

          windowParticipants = document.getElementById('participants'),
          windowDescription = document.getElementById('description');
          
          var events = JSON.parse(localStorage.getItem('events')) || [];
          

          //Every time when the date (data-cell Attribute) matches the date of existing event you show us what's inside it
          for(i=0; i<events.length; i++) {

            var matchDate = events[i].Date,

            matchDataCell = this.getAttribute('data-cell');

                if (matchDate == matchDataCell) {

                  windowEvent.value = events[i].Event;
                  windowParticipants.value = events[i].Participants;
                  windowDescription.value = events[i].Description;

                };
            
          };


            if (checkEvent.innerHTML || checkParticipants.innerHTML || checkDescription.innerHTML) {

            }

            //Else you give us empty inputs
            else {

              var clearEvent = document.getElementById('event');
              var clearParticipants = document.getElementById('participants');
              var clearDescription = document.getElementById('description');

              clearEvent.value = "";
              clearParticipants.value = "";
              clearDescription.value = "";

            };

                //The Event window location regarding to the cell
                var rect = this.getBoundingClientRect();
                editEvent.style.left = rect.left + 65 + 'px';
                editEvent.style.top = rect.top + 20 + 'px';  

                thisCell = e.target;

           
                //Show inserted Date in the window
                var newDate = document.getElementById('event_date');
                var tdate = this.getAttribute('data-cell');
                newDate.value = tdate;

          });



          //**********************Typing function*************************//

          //Create Event
          var spanNewEvent = document.querySelector('dataEvent');

          var tevent = document.getElementById('event');

          tevent.addEventListener('keyup', typeMeEvent);

          function typeMeEvent() {

            var newEvent = thisCell.getElementsByClassName('spanEvent');

              for (i=0; i<newEvent.length; i++) { 

                newEvent[i].innerHTML = this.value;

              };

          };

           //Create Participants 
           var spanNewParticipants = document.querySelector('dataParticipants');

           var tparticipants = document.getElementById('participants');
           tparticipants.addEventListener('keyup', typeMeParticipants);

            function typeMeParticipants() {

                var newParticipants = thisCell.getElementsByClassName('spanParticipants');

                for (i=0; i<newParticipants.length; i++) {

                  newParticipants[i].innerHTML = this.value;  

                };
            };

            //Create Description
            var spanNewDescription = document.querySelector('dataDescription');

            var tdescription = document.getElementById('description');
            tdescription.addEventListener('keyup', typeMeDescription);

            function typeMeDescription() {

                var newDescription = thisCell.getElementsByClassName('spanDescription');

                for (i = 0; i < newDescription.length; i++) {

                  newDescription[i].innerHTML = this.value;

                }; 

            };  
  };  


          //**********************Done button****************************
          for (var i = 0; i < cells.length; i++) {

              table.addEventListener('click', function(event) {

                    //Refers to the TD everytime a cell is clicked on
                    event = event || window.event;

                    var target = event.target || event.srcElement;

                      while(target != this) {
                    
                        if (target.tagName == 'TD') {

                             break;
                      
                        };
                    
                        target = target.parentNode;
                    
                      };

              });

          };



                    /*********Clickind Done button***********/
                    done.addEventListener('click', function() {

                      //We store Event data
                      var tevent = document.getElementById('event');

                      var storageEvent = tevent.value || '';

                      var cellEvent = tevent.value;
                      var cellEvent = thisCell.getElementsByClassName('spanEvent').value;


                      //We store Participants data
                      var tparticipants = document.getElementById('participants');
                      var storageParticipants = tparticipants.value || '';

                      //We store Description data
                      var tdescription = document.getElementById('description');
                      var storageDescription = tdescription.value || '';

                      //We store Date data
                      var newDate = document.getElementById('event_date');
                      var storageNewDate = newDate.value;


                     

                      var addNewEvent = function() {

                          var events = JSON.parse(localStorage.getItem('events')) || [];


                          events.push({Date: storageNewDate, Event: storageEvent, Participants: storageParticipants, Description: storageDescription});
                     


                            for (var i=0; i<events.length; i++) {

                               if (events[i].Date == storageNewDate) {

                                  events[i].Event = storageEvent;
                                  events[i].Participants = storageParticipants;
                                  events[i].Description = storageDescription;
           
                               };

                            };

                  
                        localStorage.setItem('events', JSON.stringify(events)); 

                      };
                      
                      addNewEvent();

                      
                      //And close the window
                      document.getElementById('addevent').style.display = 'none';

                    });


          //************************Remove Button***************************

              for (var i = 0; i < cells.length; i++) {

                table.addEventListener('click', function(event) {

                    //Refers to the TD everytime a cell is clicked on
                    event = event || window.event;

                    var target = event.target || event.srcElement;

                      while(target != this) {
                    
                          if (target.tagName == 'TD') {
                             break;
                      
                          };
                    
                          target = target.parentNode;
                    
                      };


                    remove.addEventListener('click', function() {

                      //We remove Event data
                      var tevent = document.getElementById('event');
                      tevent.value = '';

                      //We remove Participants data
                      var tparticipants = document.getElementById('participants');
                      tparticipants.value = '';
                     

                      //We remove Description data
                      var tdescription = document.getElementById('description');
                      tdescription.value = '';
     
                    });

                });

          };

      };



  //***************Close Calendar Event window**************
  var close = document.getElementById('close');

      close.addEventListener('click', function() {

              document.getElementById('addevent').style.display = 'none';

      });



   //********************Add fast Event button***********************  
   var add = document.getElementById('add');

        add.addEventListener('click', function() {
         
          var fastAdd = document.getElementById('fastAdd');

          fastAdd.style.cssText ='display: block;';
          this.style.position = 'relative';

        });


        /*********OK - Confirm fast Event adding***************/
        var ok = document.getElementById('ok');
        
        ok.addEventListener('click', function() {

            var fastAddEvent = document.getElementById('fastAddEvent');
            var fastAddDate = document.getElementById('fastAddDate');

            var fastDay = document.getElementsByClassName('out');


            /*Return the cell which coincides with the given number (Day of month)*/
            var v = fastAddDate.value;
            var tdAttr = document.querySelector('td[data-cell|="'+v+'"].out');


                    if (tdAttr) {

                        tdAttr.style.backgroundColor = 'green';
                        tdAttr.getElementsByTagName("span")[0].innerHTML = fastAddEvent.value;


                         var fastDate = tdAttr.getAttribute('data-cell');
                         var fastEvent = fastAddEvent.value;   
                         
                         var events = JSON.parse(localStorage.getItem('events')) || [];
                         localStorage.setItem('events', JSON.stringify(events));

                  

                         var addFastEvent = function() {  

                            if (events.length == 0) {

                                localStorage['events'] = events.push({

                                  Date: fastDate, 
                                  Event: fastEvent, 
                                  Participants: "", 
                                  Description: ""

                                });
                            }

                            else if (events.length > 0) {
        
                              for (var i = 0; i < events.length; i++) {

      
                                  if (events[i].Date == fastDate) {
                    
                                      events[i].Event = fastEvent;
                                      events[i].Participants = "";
                                      events[i].Description = "";
                                      
                                
                                  };

                                 
                              };


                            };


                            localStorage.setItem('events', JSON.stringify(events));

                        };


                        addFastEvent();

                    };
              
                
              function closeFastAddWindow () {

                 document.getElementById('fastAdd').style.display = 'none';

              };

              closeFastAddWindow();


        });


        
      /*Close Fast Add Event window*/
      var fastAddClose = document.getElementById('fastAddClose');

      fastAddClose.addEventListener('click', function() {

            document.getElementById('fastAdd').style.display = 'none';

            document.getElementById('fastAddEvent').value = "";

            document.getElementById('fastAddDate').value = "";

          });





   //*****************Refresh button*******************
   var refresh = document.getElementById('refresh');

        refresh.addEventListener('click', function() {

          location.reload();

        });


   //***************Search code*******************     
   var eventDatalist = document.getElementById('eventDatalist');
   var findEvent = document.getElementById('findEvent');



    var now = new Date();  
    createCalendar('cal', now.getFullYear(), now.getMonth(), now.getDate());