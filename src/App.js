import React, { Component } from 'react';
import './App.css';
import copyImg from './img/copy.png'
import clearImg from './img/clear.png'
import * as moment from 'moment';
import { addFood } from './actions/firebase'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      foodName: '',
      byName: ''
    }
  }

  componentDidUpdate () {
    console.log(this.state.byName)
  }

  handleInputChange = (type, event) => {
    // console.log(event.target.value)
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

  handleSubmit() {

    
  }

  render() {
    return (
      <div className="App">
        <header className="title-style">Sangahaan</header>

        {/* หน้าสั่งอาหาร */}
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
                onChange={this.handleInputChange.bind(this, 'food')}
              />
            </div>
            <div className='input-div'>
              <input 
                type="text" 
                className='menu-name-input' 
                name="name" 
                placeholder='ชื่อคนสั่ง' 
                onChange={this.handleInputChange.bind(this, 'name')}
              />
            </div>
            <div className="button-div">
              <button className='button-style'>
                สั่งเลย
              </button>
            </div>
          </div>
        </section>

        {/* หน้ารายการสั่งอาหาร */}
        <section>
          <div className="section1">
            <div className='header1'>รายการที่สั่ง</div>
            <div className="h-line"></div>
            <div className='list-div'>

              {/* ข้อ 1  */}
              <div className='row-list'>
                <div>
                  <div>1.ข้าวกระเพราหมูกรอบไข่ดาว</div>
                  {/* <div className='list-detail'>2 ea | ของ แดง</div> */}
                </div>
                <div className='list-btn-div'>
                2
                </div>
              </div>

              {/* ข้อ 2  */}
              {/* <div className='row-list'>
                <div>
                  <div>2.ก๋วยเตี๋ยวผัดซีอิ๊ว</div>
                  <div className='list-detail'>2 ea | ของ ไมค์,ใหม่,ปอ</div>
                </div>
                <div className='list-btn-div'>
                  <button className='copy-btn' >
                    <img src={copyImg} style={{width: '20px'}} />
                  </button>
                  <div className="v-line"></div>
                  <button className='copy-btn' >
                    <img src={clearImg} style={{width: '14px'}} />
                  </button>
                </div>
              </div> */}

              {/* ข้อ 3  */}
              {/* <div className='row-list'>
                <div>
                  <div>3.ก๋วยเตี๋ยวผัดซีอิ๊ว x 1 ชุด</div>
                  <div className='list-detail2'>
                    <div className='list-title-div'>
                      สั่งโดย
                    </div>
                    <div className='list-name-div'>
                      <div>
                        <div>1. แดง</div>
                        <div>ลบ</div>
                      </div>
                      <div>2. ไมค์</div>
                      <div>3. เหลือง</div>
                    </div>
                  </div>
                </div>
              </div> */}

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
