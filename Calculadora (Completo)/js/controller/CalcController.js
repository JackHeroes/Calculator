class CalcController{

    constructor(){

        this._timeEl = document.querySelector('#time');
        this._dateEl = document.querySelector('#date');
        this._historicEl = document.querySelector('#historic');
        this._displayCalcEl = document.querySelector('#display');
        this._audio = new Audio('/audio/click.wav');
        this._audioOnOff = false;
        this._currentDate;
        this._locale = 'pt-BR';
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.initialize();
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

        document.querySelector('#audio').addEventListener('click', e =>{

            this.toggleAudio();    
        })

        let icon = document.querySelector('#audio');
        icon.addEventListener('click', e =>{
            if(icon.classList.contains('bi-volume-up-fill')){
                icon.classList.remove('bi-volume-up-fill');
                icon.classList.add('bi-volume-mute-fill');
            } else{
                icon.classList.remove('bi-volume-mute-fill');
                icon.classList.add('bi-volume-up-fill');
            }
        });
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){

        if(this._audioOnOff){
            
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){

        document.addEventListener('keyup' , e =>{

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

    setDisplayDateTime(){

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {day: '2-digit', month: 'long', year: 'numeric'})
    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);
        
        if(!lastNumber) lastNumber = [0];

        this.displayCalc = lastNumber;
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    ClearLast(){

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){

        return (['+','-','*','/'].indexOf(value) > -1);
    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();
        }
    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){

                this.setLastOperation(value);
            } else if(isNaN(value)){

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

    setError(){

        this.displayCalc = 'Erro';
    }

    execBtn(value){

        this.playAudio();

        switch(value){

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'cl':
                this.ClearLast();
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

    initButtonsEvents(){

        let buttons = document.querySelectorAll('#buttons > section > button');

        buttons.forEach((btn, index) =>{

            this.addEventListenerAll(btn, 'click drag', e =>{

                let textBtn = btn.className.replace('btn-', '');

                this.execBtn(textBtn);
            });
        });
    }

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

    get displayHistoric(){

        return this._historicEl.innerHTML
    }

    set  displayHistoric(value){

        return this._historicEl.innerHTML = value
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

    get currentDate(){

        return new Date();
    }

    set currentDate(value){

        this._currentDate = value;
    }
}