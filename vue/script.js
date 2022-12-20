
const app = {
  data() {
    return {
      fullCalendarData: '',
      todos: '',
      maskOpen: false,
      formsOpen: false,
      maskOpen: false,
      formsOpen: false,
      active: false,
      eventClick: '',
      clickDay:'',
      bodyWeight: '',
      bodyTemperature: '',
      PhysicalCondition: '',
      startDateValue: '',
      startTimeValue: '',
    }
  },
  methods: {
    maskClose() {
      this.maskOpen = false
      this.formsOpen = false
      this.active = false
    },
    // removeItem(){
    //   this.todos.splice(findElement,1)
    //   e.event.remove()
    //   this.maskOpen = false
    //   this.formsOpen = false
    //   this.active = false
    //   chartUpDate()
    // },
  },
  mounted: function() {
    const self = this
    const todosTitle = JSON.parse(localStorage.getItem('title'))
    const todosDate = JSON.parse(localStorage.getItem('startDate'))
    const todosTime = JSON.parse(localStorage.getItem('startTime'))
    let todos = JSON.parse(localStorage.getItem('todos'))
    const calendarEl = document.getElementById('calendar');
    
    this.fullCalendarData = new FullCalendar.Calendar(calendarEl, {
      // const calender = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'ja',
      dayCellContent: function(e) {
        e.dayNumberText = e.dayNumberText.replace('日', '');
      },
      height: 400,
      events: [],

      // eventClick: function(e) {
      eventClick: e => {
        this.maskOpen = true
        this.active = true
        let clickDate = new Date(e.event.start).getDate()
        let clickMonth = new Date(e.event.start).getMonth() + 1
        this.clickDay = `${clickMonth}/${clickDate}`
        this.bodyWeight= e.event.extendedProps.bodyWeight 
        this.bodyTemperature = e.event.extendedProps.bodyTemperature
        this.PhysicalCondition = e.event.extendedProps.PhysicalCondition
        
        this.eventClick = e
        console.log(this.eventClick)
        // document.querySelector('.eventClickOpenText').textContent = `${e.event._def.title}を削除しますか？`
        // document.querySelector('.todayDate').textContent = clickDay + "の記録"
        // document.querySelector('.bodyWeight').textContent = "体重:" + e.event.extendedProps.bodyWeight + "kg" 
        // document.querySelector('.bodyTemperature').textContent = "体温:" + e.event.extendedProps.bodyTemperature + "℃"
        // document.querySelector('.PhysicalCondition').textContent = "疲労度:" + e.event.extendedProps.PhysicalCondition

        let clickElement = e.event._def.title
        let findElement = todos.findIndex(el => el.title === clickElement)
        
        document.querySelector('.removeItem').addEventListener('click', () => {
            todos.splice(findElement,1)
            e.event.remove()
            this.maskOpen = false
            this.formsOpen = false
            this.active = false
            chartUpDate()
        })

      },

      // dateClick: function(info) {
      dateClick: info => {
        this.formsOpen = true
        this.maskOpen = true
        let today = new Date()
        let todayHour = today.getHours().toString().padStart(2, '0')
        let todayMin = today.getMinutes().toString().padStart(2, '0')
        // let nowTime = `${todayHour}:${todayMin}`
        this.startDateValue = info.dateStr
        this.startTimeValue = `${todayHour}:${todayMin}`

        // document.forms.events.startDate.value = info.dateStr;
        // document.forms.events.startTime.value = nowTime;
      },
      
    });
    
    // calender.render();
    this.fullCalendarData.render();

    if(todos) {
      todos.forEach(todo => {
        // calender.addEvent(todo)
        this.fullCalendarData.addEvent(todo)
        // localStorage.setItem('todos', JSON.stringify(calender.getEvents()))
        localStorage.setItem('todos', JSON.stringify(this.fullCalendarData.getEvents()))
      });
    }

    const forms = document.forms.events
    // forms.addEvent.addEventListener('click', function(e) {
    forms.addEvent.addEventListener('click', e => {
      e.preventDefault()
      let todayBodyWeight = document.forms.events.bodyWeight.value,
          bodyTemperature = document.forms.events.bodyTemperature.value,
          PhysicalCondition = document.forms.events.PhysicalCondition.value 
      const title = forms.eventTitle.value,
            startDate = forms.startDate.value,
            startTime = forms.startTime.value

      if (title && startDate) {
        // calender.addEvent({
        this.fullCalendarData.addEvent({
          title: title,
          start: `${startDate}T${startTime}`,
          bodyWeight: todayBodyWeight,
          bodyTemperature: bodyTemperature,
          PhysicalCondition: PhysicalCondition
        })
        // localStorage.setItem('todos', JSON.stringify(calendar.getEvents()))
        localStorage.setItem('todos', JSON.stringify(this.fullCalendarData.getEvents()))
        this.maskOpen = false
        this.formsOpen = false
        this.active = false
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
  },
  computed: {
    
  },
}

Vue.createApp(app).mount('#app')
