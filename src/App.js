import React, { Component } from 'react'
import './App.css';
// import copyImg from './img/copy.png'
// import clearImg from './img/clear.png'
// import * as moment from 'moment'
// import { addFood } from './actions/firebase'
import * as firebase from 'firebase'
// import firebase from 'firebase/app';
// import 'firebase/database'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      foodName: '',
      byName: '',
      test1 : [],
      test2: '',
      items: {},
    }
  }

  componentDidMount () {

    firebase.database().ref('foods').on('value', snapshot => {
      // console.log(snapshot.val())
      if (snapshot.val()) {
        this.setState({
          items: snapshot.val()
        })
      } else {
        this.setState({ items: {} })
      }
    })
  }

  handleInputChange = (type, event) => {
    if (type === 'food') {
      this.setState({
        foodName: event.target.value
      })
    } else if (type === 'name') {
      this.setState({
        byName: event.target.value
      })
    }
  }

  addItem = (index, event) => {
    let newState = Object.assign({}, this.state.items)
    let inx = index
    newState[inx].quantity = newState[inx].quantity + 1
    this.setState({ items: newState})
    firebase.database().ref().update({
      foods: this.state.items
    })
  }

  removeItem = (index, event) => {
    let newState = Object.assign({}, this.state.items)
    let inx = index
    console.log(newState[1])
    console.log(newState[inx])
    if (newState[inx].quantity === 1) {
      delete(this.state.items[inx])
      firebase.database().ref().update({
        foods: this.state.items
      })
    } else if (newState[inx].quantity >= 1){
      newState[inx].quantity = newState[inx].quantity - 1
      this.setState({ items: newState })
      firebase.database().ref().update({
        foods: this.state.items
      })
    }
  }

  handleSubmit() {
    if (Object.keys(this.state.items).length === 0) {
      this.setState({items : [{name: this.state.foodName, quantity: 1 }] })
      firebase.database().ref().update({
        foods: this.state.items
      })
    } else {
      this.state.items.push({name: this.state.foodName, quantity: 1 })
      firebase.database().ref().update({
        foods: this.state.items
      })
    }
    var name = document.getElementById('input-food-name')
    name.value = ''
  }

  render() {
    return (
      <div className="App">
        <header className="title-style">Sangahaan</header>
        <section>
          <div className="section1">
            <div className='header1'>สั่งอาหารของคุณ</div>
            <div className="h-line"></div>
            <div className='input-div'>
              <input 
                type="text"
                className='menu-name-input'
                name="name"
                placeholder='ชื่ออาหารที่จะสั่ง'
                id='input-food-name'
                onChange={this.handleInputChange.bind(this, 'food')}
              />
            </div>
            <div className="button-div">
              <button 
              className='order-btn-style'
              onClick={() => this.handleSubmit()}>
                สั่งเลย
              </button>
            </div>
          </div>
        </section>


        <section>
          <div className="section1">
            <div className='header1'>รายการที่สั่ง</div>
            <div className="h-line"></div>
            <div className='list-div'>

              {
                /* items.map */
                Object.keys(this.state.items).map((key, index) => 
                <div key={index} className='row-list'>
                      <div>
                        <div>{(index + 1) +'.' + this.state.items[key].name}</div>
                      </div>
                      <div className='list-btn-div'>
                        <div className='list-btn-flex'>
                          <button className='list-btn-style' onClick={this.addItem.bind(this, index)}>+</button>
                        </div>
                        <div className='list-btn-flex list-num-item'>{this.state.items[key].quantity}</div>
                        <div className='list-btn-flex'>
                          <button className='list-btn-style' onClick={this.removeItem.bind(this, index)}>-</button>
                        </div>
                      </div>
                    </div>
              )
              }

            </div>
          </div>
        </section>

        <footer>
          Created by KITTIST
        </footer>
      </div>
    );
  }
}

export default App;
