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
      byname:''
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
    })
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
      if (list.length === 1) {
        fRoot.remove()
      } else {
        list.splice(index, 1)
        fRoot.update({
          who: list
        })
      }
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
    let foodlist = this.state.items
    return (
      <div className="App">
        <header className="title-style">Sangkao 1.1.1</header>
        <section>
          Hello
        </section>
        <section>
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
        </section>


        <section>
          <div className="section1">
            <div className='header2'>
              <div>รายการที่สั่ง</div>
              <div style={{display:'flex'}}>
                  <div>
                    <button onClick={() => this.clear()} style={{display:'block'}}>clear</button>
                  </div>
                  <div>{this.state.time}</div>
              
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
                                className="who-order-det-but " 
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

            </div>
          </div>
        </section>

        {/* <footer>
          Created by KITTIST
        </footer> */}
      </div>
    );
  }
}

export default App;
