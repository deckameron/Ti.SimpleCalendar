function CalendarView(data) {
    
    var IS_ANDROID = Titanium.Platform.osname == "android";

    var cellBorderColor = data.cellBorderColor;

    var activeCellBackgroundColor = data.activeCellBackgroundColor;
    var activeCellTextColor = data.activeCellTextColor;

    var cellBackgroundColor = data.cellBackgroundColor;
    var cellTextColor = data.cellTextColor;

    var disabledCellBackgroundColor = data.disabledCellBackgroundColor;
    var disabledCellTextColor = data.disabledCellTextColor;

    var freeSpaceCellBackgroundColor = data.freeSpaceCellBackgroundColor;

    var dayOfTheWeekCellBackgroundColor = data.dayOfTheWeekCellBackgroundColor;
    var dayOfTheWeekCellTextColor = data.dayOfTheWeekCellTextColor;

    var todayBorderColor = data.todayBorderColor;
    var todayBorderWidth = data.todayBorderWidth;

    var cellBorderWidth = data.cellBorderWidth;

    var cellWidth = IS_ANDROID ? (PixelsToDPUnits(Titanium.Platform.displayCaps.platformWidth) - 32) / 7 : (Titanium.Platform.displayCaps.platformWidth - 32) / 7;

    var newDate = new Date();
    var year = newDate.getFullYear();
    var month = newDate.getMonth();
    var months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Aug", "Set", "Out", "Nov", "Dec"];
    var weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    var years = [year, year + 1];

    var disabledDates = data.disabledDates;

    var window = Titanium.UI.createWindow({
        backgroundColor : "#FFFFFF",
        modal : true
    });
    
    window.addEventListener('open', function(){
        var activity = this.getActivity();
        if (activity) {
            //activity.setSupportActionBar(toolbar);
            actionBar = activity.actionBar;
            if (actionBar) {
                actionBar.displayHomeAsUp = true;
                actionBar.onHomeIconItemSelected = function() {
                    window.close();
                };
            }
        }
    });

    window.addEventListener("postlayout", function () {
        createCalendar();
    });
    
    var masterViewWrapper = Titanium.UI.createView({
        top : 0,
        height : Titanium.UI.SIZE,
        width : Titanium.UI.FILL,
        layout : "vertical"
    });
    window.add(masterViewWrapper);
    
    if(!IS_ANDROID){
        var closeButton = Titanium.UI.createButton({
            image : "/images/round_close_black.png",
            tintColor : "#000000",
            left : 16,
            top : 36
        });
        masterViewWrapper.add(closeButton);
    
        closeButton.addEventListener("click", function () {
            window.close();
        });
    }

    //DATE
    var masterDateWrapper = Titanium.UI.createView({
        top : 16,
        width : Titanium.UI.SIZE,
        height : Titanium.UI.SIZE,
    });
    masterViewWrapper.add(masterDateWrapper);
    
    if(!IS_ANDROID){
        masterDateWrapper.addEventListener("click", function () {
            pickerWrapper.animate({
                opacity : 1
            });
        });
    }
    
    var dateAndIconWrapper = Titanium.UI.createView({
        layout : "horizontal",
        width : Titanium.UI.SIZE,
        height : Titanium.UI.SIZE,
        touchEnabled : false,
        zIndex : 10
    });
    masterDateWrapper.add(dateAndIconWrapper);

    var topDateLabel = Titanium.UI.createLabel({
        text : months[month] + " " + year,
        color : "#212121",
        touchEnabled : false,
        font : {
            fontSize : 20,
            fontWeight : "bold"
        }
    });
    dateAndIconWrapper.add(topDateLabel);

    var expandImage = Titanium.UI.createImageView({
        image : "/images/round_expand_more_black.png",
        tintColor : "#000000",
        touchEnabled : false,
        height : 24,
        width : 24,
        right : 16
    });
    dateAndIconWrapper.add(expandImage);

    var masterView = Titanium.UI.createView({
        height : Titanium.UI.SIZE,
        top : 16, 
        left : 16,
        right : 16,
        borderRadius : 4,
        borderColor : cellBorderColor,
        borderWidth : 2,
        layout : "vertical"
    });
    masterViewWrapper.add(masterView); 

    var returnDate = {
        day : null,
        month : null,
        year : null,
        string : null
    };

    var previousSelectedDate = null;
    masterView.addEventListener("click", function (m) {

        if (m.source.enabled){

            if (previousSelectedDate){
                previousSelectedDate.backgroundColor = cellBackgroundColor;
                previousSelectedDate.children[0].font = {
                    fontSize : 18,
                    fontWeight : "bold"
                };
                previousSelectedDate.children[0].color = cellTextColor;
            }

            m.source.backgroundColor = activeCellBackgroundColor;
            m.source.children[0].font = {
                fontSize : 20,
                fontWeight : "bold"
            };
            m.source.children[0].color = activeCellTextColor;

            previousSelectedDate = m.source;

            returnDate = {
                day : ("0" + m.source.day).slice(-2),
                month : ("0" + (month + 1)).slice(-2),
                year : year,
                string : year + "-" + ("0" + (month + 1)).slice(-2) + "-" + ("0" + m.source.day).slice(-2)
            };

        } else {
            alert("Naaahh!!");
        }
    });

    var confirmAndCloseButton = Titanium.UI.createButton({
        top : 16,
        title : "Selecionar"
    });
    masterViewWrapper.add(confirmAndCloseButton);

    confirmAndCloseButton.addEventListener("click", function () {
        window.fireEvent("dateSelected", {date : returnDate});
        window.close();
    });

    function createCalendar(){

        var daysInMonth = 32 - new Date(year, month, 32).getDate();
        var firstDay = (new Date(year, month)).getDay();

        topDateLabel.text = months[month] + " " + year;

        masterView.removeAllChildren();

        var weekDaysLineView = Titanium.UI.createView({
            height : cellWidth,
            left : 0,
            right : 0,
            layout : "horizontal",
            backgroundColor : "red"
        });
        masterView.add(weekDaysLineView);

        var weeks = (daysInMonth + firstDay) / 7;
        var dayOfTheMonthCounter = 1;
        for (var i = 0; i < weeks; i++){

            var lineView = Titanium.UI.createView({
                height : cellWidth,
                left : 0,
                right : 0,
                layout : "horizontal"
            });
            masterView.add(lineView);

            for (var j = 0; j < 7; j++){

                if (i === 0){
                    //WeekDays Labels
                    var weekDaysCell = createCell({
                        text : weekDays[j],
                        borderWidth : cellBorderWidth,
                        borderColor : cellBorderColor,
                        backgroundColor : dayOfTheWeekCellBackgroundColor,
                        color : dayOfTheWeekCellTextColor,
                        enabled : false,
                        font : {
                            fontSize : 16,
                            fontWeight : "bold"
                        }
                    });
                    weekDaysLineView.add(weekDaysCell);
                }

                if ((i === 0 && j < firstDay) || dayOfTheMonthCounter > daysInMonth){

                    var freeSpaceCell = createCell({
                        borderWidth : cellBorderWidth,
                        borderColor : cellBorderColor,
                        backgroundColor : freeSpaceCellBackgroundColor,
                        enabled : false
                    });
                    lineView.add(freeSpaceCell);

                    continue;
                }

                var isDateEnabled = true;
                var testDate = year + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + (dayOfTheMonthCounter)).slice(-2);
                if (disabledDates.indexOf(testDate) > -1){
                    isDateEnabled = false;
                }

                var isToday = false;
                if (year == newDate.getFullYear() &&
                    month == newDate.getMonth() &&
                    dayOfTheMonthCounter ==  newDate.getDate()){
                    isToday = true;
                }

                //if(ignoreThePast){
                    
                //}

                var dayCell = createCell({
                    text : dayOfTheMonthCounter,
                    borderWidth : isToday ? todayBorderWidth : cellBorderWidth,
                    borderColor : isToday ? todayBorderColor : cellBorderColor,
                    backgroundColor : isDateEnabled ? cellBackgroundColor : disabledCellBackgroundColor,
                    color : isDateEnabled ? cellTextColor : disabledCellTextColor,
                    enabled : isDateEnabled,
                    font : {
                        fontSize : 18,
                        fontWeight : "bold"
                    }
                });
                lineView.add(dayCell);

                isToday = false;
                dayOfTheMonthCounter = dayOfTheMonthCounter + 1;
            }
        }
    }

    function createCell(params){

        var cellView = Titanium.UI.createView({
            height : cellWidth,
            width : cellWidth,
            borderWidth : params.borderWidth,
            borderColor : params.borderColor,
            backgroundColor : params.backgroundColor,
            touchEnabled : true,
            enabled : params.enabled,
            day : params.text
        });

        var dayLabel = Titanium.UI.createLabel({
            text : params.text,
            color : params.color,
            touchEnabled : false,
            font : params.font
        });
        cellView.add(dayLabel);

        return cellView;
    }
    
    //Picker
    var yearAndMonthPicker = Titanium.UI.createPicker();
    yearAndMonthPicker.selectionIndicator = true;
    
    if(!IS_ANDROID){
        var pickerWrapper = Titanium.UI.createView({
            height : Titanium.UI.FILL,
            width : Titanium.UI.FILL,
            backgroundColor : "#FFFFFF",
            opacity : 0
        });
        window.add(pickerWrapper);
        
        pickerWrapper.add(yearAndMonthPicker);
    } else {
        masterDateWrapper.add(yearAndMonthPicker);
    }
    
    yearAndMonthPicker.addEventListener("change", function (p) {
        if (p.columnIndex == 0){
            month = p.row.value;
        } else if (p.columnIndex == 1){
            year = p.row.title;
        }
        createCalendar();
    });

    var column1 = Ti.UI.createPickerColumn();

    for(var i=0, ilen=months.length; i<ilen; i++){
        var row = Ti.UI.createPickerRow({
            title : IS_ANDROID ? months[i] + " " + year : months[i],
            value : i
        });
        column1.addRow(row);
    }

    var column2 = Ti.UI.createPickerColumn();

    for(var i=0, ilen=years.length; i<ilen; i++){
        var row = Ti.UI.createPickerRow({
            title : years[i]
        });
        column2.addRow(row);
    }
    yearAndMonthPicker.add([column1,column2]);
    
    if(!IS_ANDROID){
        var pickerConfirmButton = Titanium.UI.createButton({
            bottom : 56,
            title : "Confirmar"
        });
        pickerWrapper.add(pickerConfirmButton);
    
        pickerConfirmButton.addEventListener("click", function () {
            createCalendar();
            pickerWrapper.animate({
                opacity : 0
            });
        });
    }

    return window;
}
module.exports = CalendarView;

PixelsToDPUnits = function(ThePixels) {
    return Math.round(ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
};
