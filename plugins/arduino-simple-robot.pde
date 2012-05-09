


#include <AnalogEvent.h>
#include <ButtonEvent.h>
#include <TimedEvent.h>


short ir_distance_1_pin  = 9;   // IR distance sensor 1
short ir_distance_2_pin  = 10; // IR distance sensor 2
short light_sensor_1_pin = 11; // Light Sensor 1

long iSchedTime = 0;
long start_button_pause = 5000;

short start_button_pin = 13;
short cutoff_pin       = 14;
short bumper_1_pin     = 1;  // Bumper Button

String current_motion_state = "stop";
String current_prog_state   = "init";


short servo_1_pin = 5;
short servo_2_pin = 6;

int current_speed = 50;
int servo_stop_value = 127;


int calc_servo_value(boolean forward, int speed)
{
  int speed_diff = speed;
  int new_speed = servo_stop_value;
  if(forward == true)
  {
    new_speed = new_speed + speed_diff;
  }
  else
  {
    new_speed = new_speed - speed_diff;
  }
}

void bot_forward()
{
  if(current_motion_state == "running")
  {
    int speed = calc_servo_value(true, current_speed);
    analogWrite(servo_1_pin, speed);
    analogWrite(servo_2_pin, speed);
    current_motion_state = "forward"; 
  }
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


void bot_backward()
{
  if(current_motion_state == "running")
  {
    int speed = calc_servo_value(false, current_speed);
    analogWrite(servo_1_pin, speed);
    analogWrite(servo_2_pin, speed);
    current_motion_state = "backward";
  }
}

void bot_clockwise()
{
  if(current_motion_state == "running")
  {
    int speed1 = calc_servo_value(true,  current_speed);
    int speed2 = calc_servo_value(false, current_speed);
    analogWrite(servo_1_pin, speed1);
    analogWrite(servo_2_pin, speed2);
    current_motion_state = "clockwise";
  }
}

void bot_anticlockwise()
{
  if(current_motion_state == "running")
  {
    int speed1 = calc_servo_value(false,  current_speed);
    int speed2 = calc_servo_value(true, current_speed);
    analogWrite(servo_1_pin, speed1);
    analogWrite(servo_2_pin, speed2);
    current_motion_state = "anticlockwise";
  }
}

void bot_stop()
{
  int speed1 = calc_servo_value(false, 0);
  int speed2 = calc_servo_value(true, 0);
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


void cutoff_onUp(){
  current_motion_state = "cutoff";
  bot_stop();
}


void cutoff_onHold(){
  if(current_motion_state == "cutoff")
  {
    current_motion_state = "starting";
//    TimedEvent.addTimer(start_button_pause, start);
  }
}


void start(){
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
  
  ButtonEvent.addButton(cutoff_pin,       //button pin
                        onDown,   //onDown event function
                        cutoff_onUp,     //onUp event function
                        cutoff_onHold,   //onHold event function
                        1000,     //hold time in milliseconds
                        onDouble, //onDouble event function
                        200);     //double time interval
                        
                        
  current_motion_state = "running";
  
  ##any##                      
}


void startbuttonDown()
{
  current_motion_state = "starting";
  TimedEvent.addTimer(start_button_pause, start);
}


void loop() {
  iSchedTime = 0;
  AnalogEvent.loop();
  ButtonEvent.loop();
}

void setup() {
    
  ##setup##
  
  ButtonEvent.addButton(start_button_pin,       //button pin
                        startbuttonDown,   //onDown event function
                        onUp,     //onUp event function
                        onHold,   //onHold event function
                        1000,     //hold time in milliseconds
                        onDouble, //onDouble event function
                        200);     //double time interval
}

