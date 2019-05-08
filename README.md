# Ti.SimpleCalendar
Simple and fully customizable Calendar View for Appcelerator Titanium in JS

#### Work in progress

- [x] Working on iOS
- [ ] Working on Android 

### How to use it
```javascript
var calendar = new Calendar({
    cellBorderColor : "#DEDEDE",
    activeCellBackgroundColor : "#3BA084",
    activeCellTextColor : "#FFFFFF",
    cellBackgroundColor : "#FFFFFF",
    cellTextColor : "#212121",
    disabledCellBackgroundColor : "#D2D2D2",
    disabledCellTextColor : "#959595",
    freeSpaceCellBackgroundColor : "#D3D3D3",
    dayOfTheWeekCellBackgroundColor : "#b0bec5",
    dayOfTheWeekCellTextColor : "#212121",
    todayBorderColor : "#212121",
    todayBorderWidth : 2,
    cellBorderWidth : "1px",
    disabledDates : [
        "2019-04-10",
        "2019-04-12",
        "2019-04-13"
    ]
});

calendar.addEventListener("dateSelected", function (c) {
    /*
    day : 10
    month : 05
    year : 2019
    string : "2019-05-10"
    */
    console.log(c);
});

button.addEventListener("click", function () {
    calendar.open();
});
```

### Screenshot
![screenshot](https://github.com/deckameron/Ti.SimpleCalendar/blob/master/Simulator%20Screen%20Shot%20-%20iPhone%206s%20-%202019-05-08%20at%2015.25.31.png)
