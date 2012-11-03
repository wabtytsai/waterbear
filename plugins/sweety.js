yepnope({
    load: [ 'plugins/arduino.js'],
    complete: function(){
     console.log("sweety complete");
    }
});

(function(){
  
  var pluginname = "sweety";
  /*
  $.post('../code_template.php?type='+pluginname, function(data){aTemplates = data;}, 'json')
  .error(function(){
        $.post('plugins/'+pluginname+'-templates.json', 
              function(data){aTemplates = data;}
              ,'json');
  });
    */
// expose these globally so the Block/Label methods can find them
window.choice_lists = {
    digitalinputpins:{'push_button_pin':'Push Button',0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    analoginputpins: {'pot_pin':'Potentiometer','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    digitaloutputpins:{'LED_Green_pin':'Front LED',0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'A5'},
    analogoutputpins: {'servo_pin':'Servo', 3:'Pin 3', 5:'Pin 5', 6:'Pin 6', 9:'Pin 9', 10:'Pin 10', 11:'Pin 11'},
    alloutputpins:{'servo_pin':'Servo','LED_Green_pin':'Front LED',0:'Pin 0',1:'Pin 1',2:'Pin 2',3:'Pin 3',4:'Pin 4',5:'Pin 5',6:'Pin 6',7:'Pin 7',8:'Pin 8',9:'Pin 9',10:'Pin 10',11:'Pin 11',12:'Pin 12',13:'Pin 13','A0':'Pin A0','A1':'Pin A1','A2':'Pin A2','A3':'Pin A3','A4':'Pin A4','A5':'Pin A5'},
    };


var menus = {
  outputs: menu('Outputs', [
        {
            label: 'Dispense  a Sweet',
            script: 'dispense();',
            help: 'Dispense a Sweet'
        }
    ])
};

var demos = [
{"title":"Light","description":"","date":1350935772353,"scripts":[{"klass":"control","label":"Main Loop","script":"[[1]]","containers":1,"position":"mainloop","trigger":true,"locals":[],"sockets":[],"contained":[{"klass":"control","label":"if [boolean]","script":"if({{1}}){\n[[1]]\n}else{\n[[2]]\n}","subContainerLabels":["else"],"containers":2,"position":"any","locals":[],"sockets":[{"klass":"sensors","label":"[choice:digitalinputpins] is ON","script":"(digitalRead({{1}}) == HIGH)","containers":0,"position":"any","type":"boolean","locals":[],"sockets":["push_button_pin"],"contained":[],"next":""}],"contained":[{"klass":"outputs","label":"Set [choice:digitaloutputpins] to [choice:onoffhighlow]","script":"digitalWrite({{1}}, {{2}});","containers":0,"position":"any","locals":[],"sockets":["LED_Green_pin","HIGH"],"contained":[],"next":""},{"klass":"outputs","label":"Set [choice:digitaloutputpins] to [choice:onoffhighlow]","script":"digitalWrite({{1}}, {{2}});","containers":0,"position":"any","locals":[],"sockets":["LED_Green_pin","LOW"],"contained":[],"next":""}],"next":""}],"next":""}]}
];
populate_demos_dialog(demos);

})();
