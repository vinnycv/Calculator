import { useState } from 'react'
import './App.css'

function App() {
  const [formula, setFormula] = useState([0]);
  const [input, setInput] = useState([0]);
  const digitLimit = 20;
  const operations = ['+', '-', '*', '/', '='];
  
  function handleInput(value) {
    // Check for digit limit
    if (input.length >= digitLimit) {
      let tempFormula = formula;
      let tempInput = input;
      setFormula([]);
      setInput('Hit Digit Limit');
      setTimeout(() => {
        setFormula(tempFormula);
        setInput(tempInput); } , 900);
      return;
    }
    // Check for valid first click 
    if (input[0] === 0) {
      // Do nothing if first click is an operation or 0 or =
      if (['+', '*', '/', '0', '='].includes(value)) return;
      // If first click is valid, update display and stack formula
      else {
      setInput([value]);
      setFormula([value]);
      return;
      }
    }
    // Don't allow for multiple decimals in the input display (allowed in formula)
    if (value === '.' && input.includes('.')) return;
    
    
    // If = has been clicked and output
    if (formula.includes('=')) {
      // If next click is an operation, begin formula with previous output
      if (['+', '*', '/', '-'].includes(value)) {
        setInput([value]);
        setFormula([input, value]);
        return;
      }
      // If next click is a number, reset formula with just the number
      setInput([value]);
      setFormula([value]);
      return;
    }
    
    // Operation symbol clicked
    if (['+', '*', '/', '-'].includes(value)) {
      // If already +- -- *- or /-, reset with new operation
      if (['+', '*', '/', '-'].includes(formula[formula.length - 2]) && ['+', '*', '/', '-'].includes(formula[formula.length - 1])) {
          setInput([value]);
          setFormula(formula.slice(0, formula.length - 2).concat(value));
          return;
          }
      setInput([value]); // Update input display to current click
      // Don't let formula stack operations next to eachother, unless - is second
      if (['+', '*', '/', '-'].includes(formula[formula.length - 1])) {
        // allow - to be used as negative after operation
        if (value === '-') { 
          // Allow only one '-' after an operation
          if (['+', '*', '/', '-'].includes(formula[formula.length - 2]) && formula[formula.length - 1] === '-') {
            return;
          }
          setFormula([...formula, value]);
          return;
        } 
        else {
          setFormula(formula.slice(0, formula.length - 1).concat(value));
          return;
        }
      } else { // If formula ends with a number
        setFormula([...formula, value]);
        return;
      }
    }
    
    // Clicking non0 number after an operation, reset input display and stack formula
    if (['+', '*', '/', '-'].includes(input[0])) {
      setInput([value]);
      setFormula([...formula, value]);
      return;
      }
      
    // Just clicking numbers, stack input and formula display
    setFormula([...formula, value]);
    setInput([...input, value]);
  }
  
  function handleClear() {
    setFormula([0]);
    setInput([0]);
  }
  
  function handleEquals() {
    let precision = 4;
    let precisionArr = [];
    function maxPrecision(arr) {
        if (arr.includes('.')) {
          let count = 0;
          let start = arr.indexOf('.') + 1
          let tempArr = arr.slice(start);
          for (let x of tempArr) {
            if (!operations.includes(x)) {
              count++;
            } else break;
          }
          precisionArr.push(count);
          maxPrecision(tempArr);
          return;
        } else return;
      }
    if (formula.includes('.')) {
      maxPrecision(formula);
      precision = Math.max(...precisionArr);
    }
    let equals = eval(formula.join(''));
    if (equals % 1 === 0) {
      precision = 0;
    }
    if (equals.toString().split('').includes('.')) {
      let lengthAfterDecimal = equals.toString().slice(equals.toString().indexOf('.') + 1).length;
      if (lengthAfterDecimal > 4) {
        precision = 4;
      } else {
        precision = lengthAfterDecimal;
      }
    }
    setInput([equals.toFixed(precision)]);
    setFormula([...formula, '=', equals.toFixed(precision)]);
  }
  
  function handleColorChange() {
    const toggle = document.getElementById("toggle");
    const root = document.getElementById('root');
    const display = document.getElementById('displays');
    const formula = document.getElementById('formula-display');
    const equal = document.getElementById('equals');
    const clear = document.getElementById('clear');
    const buttonBoard = document.getElementsByClassName('button-board')[0];
    const buttons = document.getElementsByClassName('button');
    const fbuttons = document.getElementsByClassName('func-button');
    console.log('in');
    if (toggle.checked === true) {
      console.log("checked");
      root.style.backgroundImage = 'url(https://getwallpapers.com/wallpaper/full/b/a/0/365455.jpg)';
      display.style.backgroundColor = 'black';
      display.style.border = '2px solid black';
      buttonBoard.style.border = '3px solid black';
      formula.style.color = 'Lime';
      equal.style.backgroundColor = 'MediumBlue';
      clear.style.backgroundColor = 'red';
      for (let i = 0; i < 11; i++) {
        buttons[i].style.backgroundColor = 'SteelBlue';
        buttons[i].style.border = '1px solid black';
      }
      for (let i = 1; i < 5; i++) {
        fbuttons[i].style.backgroundColor = 'DeepSkyBlue';
        fbuttons[i].style.border = '1px solid black';
      }
      return;
    } else {
      console.log("not checked");
      root.style.backgroundImage = 'url(https://getwallpapers.com/wallpaper/full/b/c/7/384884.jpg)';
      display.style.backgroundColor = 'rgb(17, 49, 59)';
      display.style.border = '2px solid rgb(17, 49, 59)';
      buttonBoard.style.border = '1px solid rgb(17, 49, 59)';
      formula.style.color = 'darkorange';
      equal.style.backgroundColor = 'DarkTurquoise';
      clear.style.backgroundColor = 'tomato';
      for (let i = 0; i < 11; i++) {
        buttons[i].style.backgroundColor = 'wheat';
        buttons[i].style.border = '1px solid rgb(17, 49, 59)';
      }
      for (let i = 1; i < 5; i++) {
        fbuttons[i].style.backgroundColor = 'Khaki';
        fbuttons[i].style.border = '1px solid rgb(17, 49, 59)';
      }
    }
    
  }
  
  return (
    <>
      <Toggle changeColor={handleColorChange}/>
      <Display input={input} formula={formula}/>
      <ButtonBoard 
        input={handleInput} 
        clear={handleClear}
        equals={handleEquals} />
    </>
  )
}

function Display({ input, formula }) {
  
  return (
    <div id="displays">
      <p id="formula-display">{formula.join('')}</p>
      <p id="display">{input}</p>
    </div>
  )
}

function ButtonBoard({ input, clear, equals }) {
  return (
    <div className="button-board">
      <FuncButton id="clear" name='AC' input={clear}/>
      <FuncButton id="divide" name='/' input={input}/>
      <FuncButton id="multiply" name='*' input={input}/>
      <Button id="seven" name='7' input={input}/>
      <Button id="eight" name='8' input={input} />
      <Button id="nine" name='9' input={input} />
      <FuncButton id="subtract" name='-' input={input} />
      <Button id="four" name='4' input={input} />
      <Button id="five" name='5' input={input} />
      <Button id="six" name='6' input={input} />
      <FuncButton id="add" name='+' input={input} />
      <Button id="one" name='1' input={input} />
      <Button id="two" name='2' input={input} />
      <Button id="three" name='3' input={input} />
      <FuncButton id="equals" name='=' input={equals}/>
      <Button id="zero" name='0' input={input}/>
      <Button id="decimal" name='.' input={input} />
    </div>
  )
}

function FuncButton({ id, name, input }) {
  return (
    <div className="func-button" id={id} onClick={() => input(name)}>{name}</div>
  )
}

function Button({ id, name, input }) {
  
  return (
    <div className="button" id={id} onClick={() => input(name)}>{name}</div>
  )
}

function Toggle({ changeColor }) {
  return (
    <label for="toggle" className="toggle" onClick={(e) => {
      e.stopPropagation();
      changeColor();
    }
    }>
      <input id="toggle" type="checkbox" />
      <span className="slider"></span>
    </label>
  )
}

export default App
