import React, { useState, useEffect } from 'react';
import './App.css'

const url = process.env.REACT_APP_ENDPOINT
const listUrl = url + 'list'
const submitUrl = url + 'submit'

function App() {
  const [li, updateLi] = useState([])
  const [text, updateText] = useState('')

  useEffect(() => {
    const fn = async () => {
      const x = await fetch(listUrl)
      const xx = await x.json()
      updateLi(xx.list)
    }
    fn()
  }, [])

  const getList = async () => {
    const x = await fetch(listUrl)
    const xx = await x.json()
    updateLi(xx.list)
  }

  const submit = async () => {
    await fetch(submitUrl, {
      method: 'POST',
      body: JSON.stringify({
        text: text
      })
    })
    updateText('')
    getList()
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='box'>
          <h1 className='is-size-4 mb-3 has-text-weight-bold'>Submission Form</h1>

          <input
            className='input'
            id='text-input'
            placeholder='name'
            value={text}
            onChange={x => updateText(x.target.value)} />

          <button
            className='button is-primary mb-5 mt-5 is-fullwidth'
            id='submit-button'
            onClick={submit}
          >Submit</button>

          <ul id='list'>
            {li.map(x => <li
              key={x.SK}
              className='item tag is-dark'
            >{x.text}</li>)}
          </ul>

        </div>
      </header>
    </div>
  );
}

export default App;
