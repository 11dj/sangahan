import React, { Component } from 'react'
import './App.css';
import binImg from './img/bin.svg'
import * as moment from 'moment'
import * as firebase from 'firebase'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      foodName: '',
      nameList: [],
      items: {},
      time: '',
      wholist:[],
      byname:'',
      orderCount: 0
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.addItem = this.addItem.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.clear = this.clear.bind(this)
  }

  componentWillMount () {
    moment.locale()
    let currentTime = moment().format('DMMYYYY')
    console.log(moment().format('DMMYYYY'))
    this.setState({
      time: currentTime
    })
  }

  componentDidMount () {
    // this.autoClear()
    const fRoot = firebase.database().ref('current').child('foods')
    fRoot.on('value', snapshot => {
      console.log('Hello', snapshot.val())
      if (snapshot.val()) {
        this.setState({
          items: snapshot.val()
        })
      } else {
        this.setState({ items: {} })
      }
      if (snapshot.val()) {
        Object.keys(snapshot.val()).map(((value) => {
          let total = 0
          console.log(value)
          fRoot.child(value).once('value', snap2 => {
            total = total + snap2.val().quantity
          })
          this.setState({
            orderCount: total
          })
        }))
      }
    })
  }

  componentDidUpdate () {

  }

  autoClear = () => {
    const fRoot = firebase.database()
    fRoot.ref('current').once('value', snapshot => {
      if (snapshot.val()) {
        console.log('date', snapshot.val())
        if (!snapshot.val().date) {
          if (snapshot.val().date !== this.state.time) {
            fRoot.ref('histories').update({
              [snapshot.val().date]: snapshot.val()
            })
            fRoot.ref('current').remove()
          }
        }
      }
    })
    let time = moment().format('DMMYYYY')
    fRoot.ref('foods').once('value', snapshot => {
      fRoot.ref('histories').update({
        [time]: snapshot.val()
      })
    })
    fRoot.ref('foods').remove()
  }

  handleInputChange (type, event) {
    if (type === 'food') {
      this.setState({
        foodName: event.target.value
      })
    } else if (type === 'name') {
      this.setState({
        byname: event.target.value
      })
    }
  }

  handleNav (event) {
    let homeT = document.getElementById('home-page-tab')
    let menuT = document.getElementById('menu-page-tab')
    let histT = document.getElementById('history-page-tab')
    let home = document.getElementById('home-page')
    let menu = document.getElementById('menu-page')
    let hist = document.getElementById('history-page')
    console.log(event.target.id)
    if (event.target.id === 'home-page-tab') {
      homeT.className = 'nav nav-b'
      menuT.className = 'nav'
      histT.className = 'nav'
      home.style.display = 'block'
      menu.style.display = 'none'
      hist.style.display = 'none'
    } else if (event.target.id === 'menu-page-tab') {
      homeT.className = 'nav'
      menuT.className = 'nav nav-b'
      histT.className = 'nav'
      home.style.display = 'none'
      menu.style.display = 'block'
      hist.style.display = 'none'
    } else if (event.target.id === 'history-page-tab') {
      homeT.className = 'nav'
      menuT.className = 'nav'
      histT.className = 'nav nav-b'
      home.style.display = 'none'
      menu.style.display = 'none'
      hist.style.display = 'block'
    }
  }

  addItem (index, event) {
    const fRoot = firebase.database().ref('current').child('foods')

    fRoot.once('value', snapshot => {
      let item = snapshot.val()
      var keys = Object.keys(item)
      fRoot.child(keys[index]).update({
        quantity: item[keys[index]].quantity + 1
      })
    })
  }

  removeItem (index, key) {
    const fRoot = firebase.database().ref('current')
    fRoot.child('foods/' + key).once('value', snapshot => {
      let list = snapshot.val().who
      let quantity = snapshot.val().quantity
      if (list.length === 1) {
        fRoot.remove()
      } else {
        list.splice(index, 1)
        fRoot.child('foods/' + key).update({
          who: list,
          quantity: quantity - 1
        })
      }
    })
    this.setState({
      orderCount: this.state.orderCount - 1 
    })
  }

  handleSubmit (type, key) {
    const fRoot = firebase.database().ref('current')
    if (type === 'add') {
      fRoot.child('foods').child(key).once('value', snapshot => {
        fRoot.child('foods').child(key).update({
          quantity: snapshot.val().quantity + 1,
          who: snapshot.val().who.concat([this.state.byname])
        })
      })
      var name3 = document.getElementById(key)
      name3.value = ''
    } else {
      console.log(this.state.byname)
      if (this.state.byname === '') {
        alert('กรุณาใส่ชื่อด้วย')
      } else {
        fRoot.once('value', snapshot => {
          if (!snapshot.val().date) {
            fRoot.update({ date: this.state.time })
          } 
        })
        fRoot.child('foods').push({
          name: this.state.foodName,
          quantity: 1,
          who: [this.state.byname]
        })
        document.getElementById('input-food-name').value = ''
        document.getElementById('input-food').value = ''
        this.setState({
          foodName: '', 
          byname : ''
        })
      }
    }
  }

  clear () {
    const fRoot = firebase.database().ref('current')
    let time = moment().format('DMMYYYY')
    fRoot.child('foods').once('value', snapshot => {
      fRoot.child('histories').update({
        [time]: snapshot.val()
      })
    })
    fRoot.remove()
  }

  render() {
    console.log('Total : ', this.state.orderCount)
    let foodlist = this.state.items
    return (
      <div className="App">
        <header className="title-style">
          <div className='title-header'>Sangkao</div>
          <div className='title-version'>v1.3.7</div>
        </header>
        <section>
          <div className="sectionNav">
            <a className='nav nav-b' id='home-page-tab' onClick={this.handleNav.bind(this)}>Home</a>
            <div className='nav-v-line'></div>
            <a className='nav' id='menu-page-tab' onClick={this.handleNav.bind(this)}>Food menu</a>
            <div className='nav-v-line'></div>
            <a className='nav' id='history-page-tab' onClick={this.handleNav.bind(this)}>History</a>
          </div>
        </section>

        <section id='home-page'>
          {/* ส่วนหน้าสั่งอาหาร */}
          <div className="section1">
            <div className='header1'>Your order</div>
            <div className="h-line"></div>
            <div className='input-div'>
              <input 
                type="text"
                className='menu-name-input'
                name="foodname"
                placeholder='Food name'
                id='input-food-name'
                autoComplete='off'
                onChange={this.handleInputChange.bind(this, 'food')}
              />
            </div>
            <div className='input-div'>
              <input 
                type="text"
                className='menu-name-input'
                name="byname"
                placeholder="Your name"
                id='input-food'
                autoComplete='off'
                onChange={this.handleInputChange.bind(this, 'name')}
              />
            </div>
            <div className="button-div">
              <button 
              className='order-btn-style'
              id='submit'
              onClick={() => this.handleSubmit()}>
                Order now
              </button>
            </div>
          </div>

          {/* ส่วนรายชื่ออาหารและคนสั่ง */}
          <div className="section1">
            <div className='header2'>
              <div>
                Today's order list :   
                <span > {moment().format('D MMMM YYYY')} </span>
              </div>
              <div style={{display:'flex'}}>
                  <div>
                    <button onClick={() => this.clear()} className='clear-btn-style' style={{display:'block'}}>clear</button>
                  </div>
                  {/* <div>{this.state.time}</div> */}
              
              </div>
            </div>
            <div className="h-line"></div>
            <div className='list-div'>
              {
                /* items.map */
                Object.keys(foodlist || []).map((key, index) => 
                <div key={index} className='row-list'>
                  <div className="row-list-div" >
                    <div>
                      <div>{(index + 1) +'.' + foodlist[key].name + ' - ' + (foodlist[key].who.length)  + ' ea'}</div>
                    </div>
                    
                    <div className='who-order-div'>

                      <div>by :</div>

                      <div style={{marginLeft:'5px'}}>
                        {(foodlist[key].who || []).map((list, index) =>
                          <div key={index} className='who-order-div-sub'>
                            <div>{(index + 1) + '.' + list}</div>
                            <div>
                              <button 
                                className="who-order-det-but" 
                                onClick={() => this.removeItem(index, key)}
                                autoComplete='off'>
                                <img src={binImg} width={15} alt="logo" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <input type="text" name="name" id={key} className="input-add-name" placeholder="ชื่อ" onChange={this.handleInputChange.bind(this, 'name')}/>
                        <button className="btn-add" onClick={() => this.handleSubmit('add', key)}>Get in</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
              }

              <div className={`sum-list ${ this.state.orderCount > 0 ? 'show' : 'hide' }`}>
                <div className={`sum-list-div`} >
                  today {this.state.orderCount} ea
                </div>
              </div>
              <div className={`sum-list ${ this.state.orderCount > 0 ? 'hide' : 'show' }`}>
                <div className={`sum-list-div`} >
                  No order 
                </div>
              </div>


            </div>
          </div>
        </section>
        <section id='menu-page' style={{display:'none'}}>
        <img src="https://img.wongnai.com/p/1968x0/2017/08/06/87bf93c66ce04e079f66f441c3368aa7.jpg" alt="" style={{width:'100%'}}/>
        </section>

        <section id="history-page" style={{display:'none'}}>
        under construction
        </section>

        {/* <footer>
          Created by KITTIST
        </footer> */}
      </div>
    );
  }
}

export default App;
