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
    let time = moment().format('D MMMM YYYY')
    console.log(moment().format('DMMYYYY'))
    // console.log(new Date())
    this.setState({
      time: time
    })
  }

  componentDidMount () {
    const fRoot = firebase.database().ref('foods')
    fRoot.on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({
          items: snapshot.val()
        })
      } else {
        this.setState({ items: {} })
      }
      console.log(snapshot.val())
      let total = 0
      Object.keys(snapshot.val()).map(((value) => {
        fRoot.child(value).on('value', snap2 => {
          console.log(value, snap2.val().quantity)
          total = total + snap2.val().quantity
        })
        this.setState({
          orderCount: total
        })
      }))
    })
  }

  componentDidUpdate () {

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
    const fRoot = firebase.database().ref('foods')

    fRoot.once('value', snapshot => {
      let item = snapshot.val()
      var keys = Object.keys(item)
      fRoot.child(keys[index]).update({
        quantity: item[keys[index]].quantity + 1
      })
    })
  }

  removeItem (index, key) {
    const fRoot = firebase.database().ref('foods/' + key)
    fRoot.once('value', snapshot => {
      let list = snapshot.val().who
      let quantity = snapshot.val().quantity
      if (list.length === 1) {
        fRoot.remove()
      } else {
        list.splice(index, 1)
        fRoot.update({
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
    const fRoot = firebase.database().ref('foods')
    if (type === 'add') {
      fRoot.child(key).once('value', snapshot => {
        fRoot.child(key).update({
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
        fRoot.push({
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
    const fRoot = firebase.database()
    let time = moment().format('DMMYYYY')
    fRoot.ref('foods').once('value', snapshot => {
      fRoot.ref('histories').update({
        [time]: snapshot.val()
      })
    })
    fRoot.ref('foods').remove()
  }

  render() {
    console.log('Total : ', this.state.orderCount)
    let foodlist = this.state.items
    return (
      <div className="App">
        <header className="title-style">
          <div className='title-header'>สั่งข้าว</div>
          <div className='title-version'>v1.3.2</div>
        </header>
        <section>
          <div className="sectionNav">
            <a className='nav nav-b' id='home-page-tab' onClick={this.handleNav.bind(this)}>หน้าแรก</a>
            <div className='nav-v-line'></div>
            <a className='nav' id='menu-page-tab' onClick={this.handleNav.bind(this)}>เมนูอาหาร</a>
            <div className='nav-v-line'></div>
            <a className='nav' id='history-page-tab' onClick={this.handleNav.bind(this)}>ประวัติการสั่ง</a>
          </div>
        </section>

        <section id='home-page'>
          {/* ส่วนหน้าสั่งอาหาร */}
          <div className="section1">
            <div className='header1'>สั่งอาหารของคุณ</div>
            <div className="h-line"></div>
            <div className='input-div'>
              <input 
                type="text"
                className='menu-name-input'
                name="foodname"
                placeholder='ชื่ออาหารที่จะสั่ง'
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
                placeholder='ใครสั่ง'
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
                สั่งเลย
              </button>
            </div>
          </div>

          {/* ส่วนรายชื่ออาหารและคนสั่ง */}
          <div className="section1">
            <div className='header2'>
              <div>
                รายการที่สั่ง 
                <span > ตัดยอดที่เวลา </span>
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
                      <div>{(index + 1) +'.' + foodlist[key].name + ' - ' + (foodlist[key].who.length)  + ' ชุด'}</div>
                    </div>
                    
                    <div className='who-order-div'>

                      <div>คนสั่ง :</div>

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
                        <button className="btn-add" onClick={() => this.handleSubmit('add', key)}>สั่งด้วย</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
              }

              <div className={`sum-list ${ this.state.orderCount > 0 ? 'show' : 'hide' }`}>
                <div className={`sum-list-div`} >
                  รวมทั้งหมด {this.state.orderCount} ชุด
                </div>
              </div>
              <div className={`sum-list ${ this.state.orderCount > 0 ? 'hide' : 'show' }`}>
                <div className={`sum-list-div`} >
                  ยังไม่มีใครสั่งเลยครับ
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
