


#include <AnalogEvent.h>
#include <ButtonEvent.h>
#include <TimedEvent.h>

//Pins for the Ardumoto 
const int servo_1_pin = 5;
const int servo_2_pin = 6;

const int pwm_a = 10;  //PWM control for motor outputs 1 and 2 is on digital pin 10
const int pwm_b = 11;  //PWM control for motor outputs 3 and 4 is on digital pin 11
const int dir_a = 12;  //direction control for motor outputs 1 and 2 is on digital pin 12
const int dir_b = 13;  //direction control for motor outputs 3 and 4 is on digital pin 13


//Pins for the Access Space Waterbear Arduino Setup 
const int ir_distance_1_pin  = A0;   // IR distance sensor 1
const int ir_distance_2_pin  = A1; // IR distance sensor 2
const int light_sensor_1_pin = A2; // Light Sensor 1
const int builtin_LED_pin    = 12; // LEDs
const int start_button_pin   = 10;
const int cutoff_pin         = 9;
const int bumper_1_pin       = 8;  // Bumper Button
const int push_button_pin    = 7;


//Variables
long   iSchedTime              = 0;
const  long start_button_pause = 1000;

String current_motion_state    = "stop";
String current_prog_state      = "init";
int    speed_output_min        = 100;
int    speed_output_max        = 255;
int    speed_setting_max       = 10;
int    speed_setting_current   = 5;
int    speed_output_current    = 0;
int    speed_setting_turning   = 1;
int    speed_output_turning    = 0;
  

int calc_speed_output(int speed)
{
  int output = 0;
  if(speed > 0)
  {
    if (speed < speed_setting_max)
    {
      output = (speed_output_max - speed_output_min) / speed_setting_max;
    }
    else
    {
      output = speed_output_max;
    }
  }
  return output;
}

void set_speed(int speed)
{
  speed_output_current = calc_speed_output(speed); 
  speed_setting_current = speed;
}


int distance_calc(int iIrVal)
{
  float fIrVal = float(iIrVal);
  float dist = 0.0;
        if (fIrVal > 0)
        {
            dist = 12343.85 * pow(fIrVal, -1.15);
        }
        else
        {
        
            dist = 100.0 * 2;
        }
        return int(dist);
}


void bot_forward()
{
  if(current_motion_state == "running")
  {
    digitalWrite(dir_a, HIGH);
    analogWrite(pwm_a, speed_output_current);
    digitalWrite(dir_a, HIGH);
    analogWrite(pwm_b, speed_output_current);
    current_motion_state = "forward"; 
  }
}


void bot_backward()
{
  if(current_motion_state == "running")
  {
    digitalWrite(dir_a, LOW);
    analogWrite(pwm_a, speed_output_current);
    digitalWrite(dir_b, LOW);
    analogWrite(pwm_b, speed_output_current);
    current_motion_state = "backward"; 
  }
}

void bot_clockwise()
{
  if(current_motion_state == "running")
  {
    digitalWrite(dir_a, HIGH);
    analogWrite(pwm_a, speed_output_turning);
    digitalWrite(dir_b, LOW);
    analogWrite(pwm_b, speed_output_turning);
    current_motion_state = "clockwise";
  }
}

void bot_anticlockwise()
{
  if(current_motion_state == "running")
  {
    digitalWrite(dir_a, LOW);
    analogWrite(pwm_a, speed_output_turning);
    digitalWrite(dir_b, HIGH);
    analogWrite(pwm_b, speed_output_turning);
    current_motion_state = "anticlockwise";
  }
}

void bot_stop()
{
    digitalWrite(dir_a, HIGH);
    analogWrite(pwm_a, 0);
    digitalWrite(dir_a, HIGH);
    analogWrite(pwm_b, 0);
    current_motion_state = "stop";
  
}


void onChange(AnalogPortInformation* Sender) {
##onChange##
}

void onDown(ButtonInformation* Sender) {
##onDown##
}

void onUp(ButtonInformation* Sender) {
##onUp##
}

void onHold(ButtonInformation* Sender) {
##onHold##
}

void onDouble(ButtonInformation* Sender) {
##onDouble##
}


void cutoff_onUp(ButtonInformation* Sender){
  current_motion_state = "cutoff";
  bot_stop();
}


void cutoff_onHold(ButtonInformation* Sender){
  if(current_motion_state == "cutoff")
  {
    //current_motion_state = "starting";
    //TimedEvent.addTimer(start_button_pause, start);
  }
}

void onStartTime(TimerInformation* Sender){
start();
}

void start()
{
  iSchedTime = 0;

  AnalogEvent.addAnalogPort(ir_distance_1_pin,  onChange, 3);
  AnalogEvent.addAnalogPort(ir_distance_2_pin,  onChange, 3);
  AnalogEvent.addAnalogPort(light_sensor_1_pin, onChange, 3);
  
  
  ButtonEvent.addButton(bumper_1_pin,       //button pin
                        onDown,   //onDown event function
                        onUp,     //onUp event function
                        onHold,   //onHold event function
                        1000,     //hold time in milliseconds
                        onDouble, //onDouble event function
                        200);     //double time interval
  
  ButtonEvent.addButton(push_button_pin,       //button pin
                        onDown,   //onDown event function
                        onUp,     //onUp event function
                        onHold,   //onHold event function
                        1000,     //hold time in milliseconds
                        onDouble, //onDouble event function
                        200);     //double time interval
  
  /*ButtonEvent.addButton(cutoff_pin,       //button pin
                        onDown,   //onDown event function
                        cutoff_onUp,     //onUp event function
                        cutoff_onHold,   //onHold event function
                        1000,     //hold time in milliseconds
                        onDouble, //onDouble event function
                        200);     //double time interval
 */                       
                        
  current_motion_state = "running";
  
  ##any##                      
}


void startbuttonDown(ButtonInformation* Sender)
{
  current_motion_state = "starting";
  TimedEvent.addTimer(start_button_pause, onStartTime);
}


void loop() {
  iSchedTime = 0;
  AnalogEvent.loop();
  ButtonEvent.loop();
  TimedEvent.loop();

}

void setup() {
  
  pinMode(bumper_1_pin, INPUT);           // set pin to input
  digitalWrite(bumper_1_pin, HIGH);       // turn on pullup resistors
  
  pinMode(push_button_pin, INPUT);           // set pin to input
  digitalWrite(push_button_pin, HIGH);       // turn on pullup resistors
  
  pinMode(cutoff_pin, INPUT);           // set pin to input
  digitalWrite(cutoff_pin, HIGH);       // turn on pullup resistors
  
  
  pinMode(builtin_LED_pin, OUTPUT);
  pinMode(pwm_a, OUTPUT);  //Set control pins to be outputs
  pinMode(pwm_b, OUTPUT);
  pinMode(dir_a, OUTPUT);
  pinMode(dir_b, OUTPUT);
  
 
  analogWrite(pwm_a, 0);  //set both motors to run at (0/255 = 0)% duty cycle (slow)
  analogWrite(pwm_b, 0);
  
    
  speed_output_turning = calc_speed_output(speed_setting_turning); 
  speed_output_current = calc_speed_output(speed_setting_current);
  
  ##setup##
  
  ButtonEvent.addButton(start_button_pin,       //button pin
                        startbuttonDown,   //onDown event function
                        onUp,     //onUp event function
                        onHold,   //onHold event function
                        1000,     //hold time in milliseconds
                        onDouble, //onDouble event function
                        200);     //double time interval
                        
  //TimedEvent.addTimer(start_button_pause, onStartTime);                      
}

