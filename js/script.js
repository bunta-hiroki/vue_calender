
const todosTitle = JSON.parse(localStorage.getItem('title'))
const todosDate = JSON.parse(localStorage.getItem('startDate'))
const todosTime = JSON.parse(localStorage.getItem('startTime'))
let todos = JSON.parse(localStorage.getItem('todos'))
const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth',
  locale: 'ja',
  dayCellContent: function(e) {
    e.dayNumberText = e.dayNumberText.replace('日', '');
  },
  height: 400,
  events: [
    // {
    //   title: '神奈川仕事',
    //   start: '2022-02-10T13:00:01',
    //   constraint: 'businessHours'
    // },
  ],

  // 予定をクリックした際の挙動
  eventClick: function(e) {
    document.querySelector('.mask').classList.add('maskOpen');
    document.querySelector('.eventClickOpen').classList.add('active');
    document.querySelector('.eventClickOpenText').textContent = `${e.event._def.title}を削除しますか？`
    let clickDate = new Date(e.event.start).getDate()
    let clickMonth = new Date(e.event.start).getMonth() + 1
    let clickDay = `${clickMonth}/${clickDate}`
    document.querySelector('.todayDate').textContent = clickDay + "の記録"
    document.querySelector('.bodyWeight').textContent = "体重:" + e.event.extendedProps.bodyWeight + "kg" 
    document.querySelector('.bodyTemperature').textContent = "体温:" + e.event.extendedProps.bodyTemperature + "℃"
    document.querySelector('.PhysicalCondition').textContent = "疲労度:" + e.event.extendedProps.PhysicalCondition

    let clickElement = e.event._def.title
    let findElement = todos.findIndex(el => el.title === clickElement)
    
    document.querySelector('.removeItem').addEventListener('click', () => {
      todos.splice(findElement,1)
      e.event.remove()
      // JSON.parse(localStorage.getItem('todos'))
      document.querySelector('.mask').classList.remove('maskOpen');
      document.querySelector('.eventClickOpen').classList.remove('active');
      chartUpDate()
    })
  },

  // 日付をクリックした際の挙動
  dateClick: function(info) {
    document.querySelector('.mask').classList.add('maskOpen');
    document.querySelector('.forms').classList.add('formsOpen');
    // console.log(info)
    let today = new Date()
    let todayHour = today.getHours().toString().padStart(2, '0')
    let todayMin = today.getMinutes().toString().padStart(2, '0')
    let nowTime = `${todayHour}:${todayMin}`
    document.forms.events.startDate.value = info.dateStr;
    document.forms.events.startTime.value = nowTime;
  },
});

calendar.render();

if(todos) {
  todos.forEach(todo => {
    calendar.addEvent(todo)
    localStorage.setItem('todos', JSON.stringify(calendar.getEvents()))
  });
}

document.querySelector('.mask').addEventListener('click', () => {
  document.querySelector('.mask').classList.remove('maskOpen');
  document.querySelector('.forms').classList.remove('formsOpen');
  document.querySelector('.eventClickOpen').classList.remove('active');
})

const forms = document.forms.events
forms.addEvent.addEventListener('click', function(e) {
  e.preventDefault()
    let todayBodyWeight = document.forms.events.bodyWeight.value,
        bodyTemperature = document.forms.events.bodyTemperature.value,
        PhysicalCondition = document.forms.events.PhysicalCondition.value 
    const title = forms.eventTitle.value,
          startDate = forms.startDate.value,
          startTime = forms.startTime.value

    if (title && startDate) {
      calendar.addEvent({
        title: title,
        start: `${startDate}T${startTime}`,
        bodyWeight: todayBodyWeight,
        bodyTemperature: bodyTemperature,
        PhysicalCondition: PhysicalCondition
      })
      localStorage.setItem('todos', JSON.stringify(calendar.getEvents()))
      document.querySelector('.mask').classList.remove('maskOpen');
      document.querySelector('.forms').classList.remove('formsOpen');
      document.querySelector('.eventClickOpen').classList.remove('active');
      todos = JSON.parse(localStorage.getItem('todos'))
      chartUpDate()

    } else {
      alert("タイトルが空です")
    }

});

// -------------------chart.js-------------------------
var ctx = document.getElementById("myLineChart");
let myLineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      // labels: ['2月1日', '2月2日', '2月4日'],
      datasets: [
        {
          label: '体重',
          type: "line",
          data: [],
          // data: [60,65,66],
          borderColor: "rgba(255,0,0,1)",
          backgroundColor: "rgba(0,0,0,0)",
          hidden: false
        },
        {
          label: '体温',
          type: "line",
          data: [],
          borderColor: "blue",
          backgroundColor: "rgba(0,0,0,0)",
          hidden: false,
          "yAxisID": "y-axis-2",
        },
        {
          label: '疲労度',
          type: "bar",
          data: [],
          borderColor: "rgba(75, 192, 192, 0.2)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          hidden: false,
          "yAxisID": "y-axis-3",
          "borderWidth": 1,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: '記録'
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMax: 70,
              suggestedMin: 55,
              stepSize: 2,
              callback: function(value, index, values){
                return  value +  'kg'
              }
            },
          },
          {
            id: "y-axis-2",
            type: "linear",
            position: "right",
            ticks: {
              suggestedMax: 40,
              suggestedMin: 35,
            },
          },
          {
            id: "y-axis-3",
            type: "linear",
            position: "right",
            ticks: {
                max: 10,
                min: 0,
            },
          }
        ]   
      },
    },
  })

function chartUpDate() {
  localStorage.setItem('todos', JSON.stringify(todos))
  todos = JSON.parse(localStorage.getItem('todos'))

  let sortTodos = todos.sort(function(a, b) {
    return (a.start < b.start) ? -1 : 1; 
  });
  
  myLineChart.data.labels.length = 0
  for (let i = 0; i < 3; i++) {
    myLineChart.data.datasets[i].data.length = 0
  }

  sortTodos.forEach(a => {
    let time = a.start
    let monthList = (new Date(time).getMonth() + 1)
    let dayList = (new Date(time).getDate())
    let pushDay = monthList + "/" + dayList 
    let entryBodyWeight = a.extendedProps.bodyWeight
    let bodyTemperature = a.extendedProps.bodyTemperature
    let PhysicalCondition = a.extendedProps.PhysicalCondition

    if (entryBodyWeight && bodyTemperature && PhysicalCondition){
      myLineChart.data.labels.push(pushDay)
      myLineChart.data.datasets[0].data.push(entryBodyWeight)
      myLineChart.data.datasets[1].data.push(bodyTemperature)
      myLineChart.data.datasets[2].data.push(PhysicalCondition)
      myLineChart.data.labels
      myLineChart.data.datasets[0].data.datasets
      myLineChart.data.datasets[1].data.datasets
      myLineChart.data.datasets[2].data.datasets
    }
  })
  myLineChart.update();
}
chartUpDate();

