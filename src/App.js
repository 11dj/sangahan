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
      byName: [],
      items: {},
      time: '',
      wholist:[]
    }
  }

  componentWillMount () {
    moment.locale()
    let time = moment().format('D MMMM YYYY')
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
    const fRoot = firebase.database().ref('foods')

    fRoot.once('value', snapshot => {
      let item = snapshot.val()
      var keys = Object.keys(item)
      fRoot.child(keys[index]).update({
        quantity: item[keys[index]].quantity + 1
      })
    })
  }

  removeItem = (index, key) => {
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

  handleSubmit = (type, key) => {
    const fRoot = firebase.database().ref('foods')
    if (type === 'add') {
      fRoot.child(key).once('value', snapshot => {
        fRoot.child(key).update({
          quantity: snapshot.val().quantity + 1,
          who: snapshot.val().who.concat([this.state.byName])
        })
      })
      var name3 = document.getElementById(key)
      name3.value = ''
    } else {
      fRoot.push({
        name: this.state.foodName,
        quantity: 1,
        who: [this.state.byName]
      })
      document.getElementById('input-food-name').value = ''
      document.getElementById('input-food').value = ''
    }
  }

  render() {
    let foodlist = this.state.items
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
                autoComplete='off'
                onChange={this.handleInputChange.bind(this, 'food')}
              />
            </div>
            <div className='input-div'>
              <input 
                type="text"
                className='menu-name-input'
                name="name"
                placeholder='ใครสั่ง'
                id='input-food'
                autoComplete='off'
                onChange={this.handleInputChange.bind(this, 'name')}
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
            <div className='header2'>
              <div>รายการที่สั่ง</div>
              <div>{this.state.time}</div>
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
