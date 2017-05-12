import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import JSONdata from './data.json'

class App extends Component {
    constructor(props){
        super(props);

        //set state by fetching bellow
        this.state = (localStorage.soccerDayState) ? JSON.parse(localStorage.soccerDayState) :
        {
            //soccerDays: JSONdata.displayAllSoccerDays
            soccerDays: [],
            errors: [],
            goal: 10
        };

        //store data on var
        const apiURL = JSONdata.displayAllSoccerDays;
        console.log(apiURL);

        this.addDay = this.addDay.bind(this);
        this.setGoal = this.setGoal.bind(this);
        this.addError = this.addError.bind(this);
        this.clearErrorAt = this.clearErrorAt.bind(this);
        this.countDays = this.countDays.bind(this);
        this.removeDay = this.removeDay.bind(this);
    }

    //countDays
    countDays(filter) {
      return this.state.soccerDays.filter(day=> (filter) ? day[filter] : day).length
    }

    //addDay
    addDay(newDay) {
        const alreadyPlayed = this.state.soccerDays.some(day => day.date === newDay.date);
        if(alreadyPlayed) {
            this.addError(`You already skied on ${newDay.date}`)
        } else {
            this.setState({
                currentScreen: 'home',
                soccerDays: [
                    ...this.state.soccerDays,
                    newDay
                ]
            })
        }
    }

    //removeDay
    remove(day){
        const soccerDays = this.state.soccerDays.filter(({date}) => date !== day);
        this.setState({soccerDays})
    }

    //addError
    addError(message) {
        this.setState({
            errors: [
                ...this.state.errors,
                new Error(message)
            ]
        })
    }

    //clearError
    clearErrorAt(index) {
        const errors = this.state.errors.filter((err, i) => index !== i);
        this.setState({errors})
    }

    //setGoal
    setGoal(goal) {
        this.setState({goal})
    }

    componentWillMount() {
        this.handleError = ({message}) => this.addError(`Something went wrong ${message}`);
        window.addEventListener("error", this.handleError)
    }

    componentDidMount() {
        localStorage.soccerDayState = JSON.stringify(this.state)
    }

    componentWillUnmount() {
        window.removeEventListener("error", this.handleError)
    }

    componentDidUpdate() {
        localStorage.soccerDayState = JSON.stringify(this.state)
    }


  render() {
      const {soccerDays, goal, errors } = this.state,
          { location, params } = this.props,
          totalDays = soccerDays.length,
          sunnyDays = this.countDays('sunny'),
          rainyDays = this.countDays('rainy');

    return (
      <div className="App">
          <Menu goal={goal} onNav={this.goToScreen}/>

          {(location.pathname === '/') ?
              <SkiDayCount total={totalDays}
                           goal={goal}
                           sunny={sunnyDays}
                           rainy={rainyDays}/> :
              (location.pathname === '/add-day') ?
                  <AddDayForm onNewDay={this.addDay}
                              onError={this.addError}
                  /> :
                  <SkiDayList days={soccerDays} filter={params.filter} onRemoveDay={this.removeDay} />
          }

          {(errors.length) ?
              errors.map((err, i) =>
                  <ShowError key={i}
                             onClose={() => this.clearErrorAt(i)}
                             message={err.message}
                             offset={i*3}/>
              ) : null
          }

          <GoalProgress current={soccerDays.length} goal={goal} save={this.setGoal}/>
      </div>
    );
  }
}

export default App;
