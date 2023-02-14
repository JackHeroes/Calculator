class CalcController{

    constructor(){

        this._audioEl = document.querySelector('#audio')
        this._timeEl = document.querySelector('#time');
        this._dateEl = document.querySelector('#date');
        this._displayCalcEl = document.querySelector('#display');
        this._audio = new Audio('/audio/click.wav');
        this._audioOnOff = false;
        this._currentDate;
        this._locale = 'pt-br';
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.initialize();
        this.changeIcon();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize(){

        this.playAudio(true);
        
        this.setDisplayDateTime();

        setInterval(() =>{

            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
    }

// Code that turns sound on and off and switches icons.

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    changeIcon(){

        this._audioEl.addEventListener('click', () =>{

            this.toggleAudio();  

            this._audioEl.classList.toggle('bi-volume-mute-fill');
            this._audioEl.classList.toggle('bi-volume-up-fill');
        });
    }

// Code that shows the time and date on the display.

    setDisplayDateTime(){

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {day: '2-digit', month: 'long', year: 'numeric'});
    }

// Code that displays the last number entered on the display.

// 'getLastItem' get the last item in the calculator, which should be a number,
// the argument false passed to the method indicates that it should not remove the last item from the calculator,
// it should only obtain its value without deleting it.

// 'if' condition to check whether the value obtained by calling the 'getLastItem' method is 'falsy' (null, undefined, false, 0, NaN, or an empty string),
// if the value is 'falsy', the variable 'lastNumber' is assigned an array with a single element containing the value '0',
// this is a way to define a default value for the variable if the 'getLastItem' method does not return a valid value.

// Assigns the value of 'lastNumber' to the 'displayCalc' property,
// this means that the value obtained by the 'getLastItem' method or the default value '0' will be displayed in the calculator.

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);
        
        if(!lastNumber) lastNumber = [0];

        this.displayCalc = lastNumber;
    }

// The 'addEventListenerAll' function adds multiple event listeners to an HTML element,
// it takes three parameters: 'element (the HTML element to add the listeners to)', 'events (a string with the names of the events to add separated by spaces)', 'fn (the callback function to be executed when the event is triggered)'.

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);
        });
    }

// The 'initButtonsEvents' function initializes the events for the buttons of the calculator,
// it first selects all the buttons with the selector '#buttons > section > button' and stores them in the buttons variable,
// it then uses a forEach loop to add the event listeners to each button,
// calling 'addEventListenerAll' with the button element, the events 'click drag', and a callback function that extracts the button class name and passes it to execBtn,
// the execBtn method is responsible for executing the corresponding operation for the button that was clicked.

    initButtonsEvents(){

        let buttons = document.querySelectorAll('#buttons > section > button');

        buttons.forEach((btn) =>{

            this.addEventListenerAll(btn, 'click drag', () =>{

                let textBtn = btn.className.replace('btn-', '');

                this.execBtn(textBtn);
            });
        });
    }

// The presented code shows a function called 'execBtn' that is responsible for performing an action based on the value of a button pressed on the calculator.

// 'playAudio' is responsible for playing a sound when a button is pressed on the calculator.

// Switch control flow structure that evaluates the value of the parameter 'value',
// depending on the 'value', a different action is taken on the calculator,
// such as clearing all numbers (ac), clearing the last entry (ce), adding an operation (/, *, -, +), adding a decimal point (.), calculating the operation (equal), or adding a number (0 to 9).
// if the value of the parameter value does not correspond to any of these options, the function calls another function called 'setError', which displays an error on the calculator.

    execBtn(value){

        this.playAudio();

        switch(value){

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'division':
                this.addOperation('/');
                break;

            case 'multiplication':
                this.addOperation('*');
                break;

            case 'subtraction':
                this.addOperation('-');
                break;

            case 'addition':
                this.addOperation('+');
                break;

            case 'dot':
                this.addDot();
                break;

            case 'equal':
                this.calc();
                break;
                
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
                
            default:
                this.setError();
                break;
        }
    }

// 'clearAll' function is responsible for resetting the calculator's operation, last number, and last operator to their default values.

    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

// 'clearEntry' function is responsible for removing the last item from the current operation in the calculator.

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();
    }

// The 'getLastOperation()' method returns the last item in the '_operation' array.

    getLastOperation(){

        return this._operation[this._operation.length-1];
    }

// 'The setLastOperation(value)' method sets the last item in the '_operation' array to the provided value.

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;
    }

// The 'isOperator(value') method checks if the provided 'value' is an operator (+, -, *, /) and returns a boolean value.

// The method 'indexOf()' is used to search for the index of the first occurrence of the value in the array ['+','-','*','/'],
// if the value is not found, the method returns -1,
// since the returned value is being compared to -1 using the greater than operator (>), if the value is found in the array, 
// the expression will evaluate to true, otherwise it will evaluate to false.

    isOperator(value){

        return (['+','-','*','/'].indexOf(value) > -1);
    }

// The 'pushOperation(value)' method pushes the provided value into the '_operation' array, 
// if the length of the '_operation' array is greater than 3, it calls the 'calc()' method to perform a calculation.

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();
        }
    }

// 'addOperation' is responsible for adding an operation to the calculator,
// the function starts by checking if the last value of the operation is a number or not,
// if it is not a number, the function checks if the value to be added is an operator,
// if it is an operator, the value is set as the last operation.

// If the value to be added is not an operator, then it is a number,
// the function adds the number to the operation and updates the calculator display.

// If the last value of the operation is a number, the function checks if the value to be added is an operator,
// if it is an operator, the operation is added and the display is updated,
// if it is not an operator, the function concatenates the new value with the last value of the operation and updates the calculator display with the new concatenated value.

    addOperation(value){

        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){

                this.setLastOperation(value);
            } else{

                this.pushOperation(value);

                this.setLastNumberToDisplay();
            }
        } else{

            if(this.isOperator(value)){

                this.pushOperation(value);
            } else{

                let newValue;

                if(this.getLastOperation().toString() !== '0'){

                    newValue = this.getLastOperation().toString() + value.toString();
                } else{

                    newValue = value.toString();
                }

                this.setLastOperation(newValue);
                 
                this.setLastNumberToDisplay();
            }
        }
    }

// 'addDot' is responsible for adding a decimal point to the current number in the calculator,
// the function starts by getting the last value from the operation in the calculator.

// The function checks if the last operation value is a string and already contains a decimal point,
// if true, the function returns without doing anything,
// this prevents the addition of more than one decimal point to the same number.

// If the last operation value is an operator or if there is no value defined yet, 
// the function adds a zero and the decimal point,
// otherwise, the function concatenates the decimal point with the last value in the operation.

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || lastOperation === undefined){
            this.pushOperation('0.');
        } else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

// The method first gets the last operator used in the operation by calling the 'getLastItem' method, 
// with the default argument 'isOperator' as true.

// if there are less than 3 items in the operation array, 
// the method creates a new array with the first item of the previous array, the last operator and the last number.

// If there are more than 3 items in the operation array, 
// the method pops the last item of the array, calculates the result of the operation, 
// and saves the result as the last number used in the operation.

// If there are exactly 3 items in the operation array, 
// the method gets the last number used in the operation by calling the 'getLastItem' method ,
// with the argument "isOperator" as false.

// The method then calculates the result of the operation and saves it as the first item of the operation array,
// if the 'last' variable is not empty, the method pushes it to the end of the operation array,

    getResult(){

        return eval(this._operation.join(''));
    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){

                lastItem = this._operation[i];
                break;
            }
        }

        if(lastItem == 0){

            return lastItem;
        } else if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    } 

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        } else if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber= this.getResult();
        } else if (this._operation.length == 3) {

            this._lastNumber= this.getLastItem(false);
        }

        let result = this.getResult();
        
        this._operation = [result];
        
        if (last) this._operation.push(last);
        
  
        this.setLastNumberToDisplay();
    }

// 'setError' is responsible for displaying the message 'Error' on the calculator's display. 

    setError(){

        this.displayCalc = 'Erro';
    }

// 'initKeyboard' function is responsible for setting up the use of the keyboard to operate the calculator.

    initKeyboard(){

        document.addEventListener('keyup' , (e) =>{

            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case ',':
                case '.':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
            }
        });
    }

// The getters 'displayTime', 'displayDate', 'displayCalc',
// are used to retrieve the content of each of the HTML elements that represent the time, date, and calculator display.

// The setters 'displayTime', 'displayDate', 'displayCalc' 
// are used to update the content of each of the HTML elements that represent the time, date, and calculator display.

    get displayTime(){

        return this._timeEl.innerHTML;
    }

    set displayTime(value){

        return this._timeEl.innerHTML = value;
    }

    get displayDate(){

        return this._dateEl.innerHTML
    }

    set displayDate(value){

        return this._dateEl.innerHTML = value
    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if (value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

// The getter 'currentDate' returns the current date and time.

// The setter 'currentDate' allows you to set the current date and time.

    get currentDate(){

        return new Date();
    }

    set currentDate(value){

        this._currentDate = value;
    }
}