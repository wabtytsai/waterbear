var directioncalcs = {
  "up":   function(pos, distance){return {x:pos.x, y:pos.y+distance, z:pos.z};},
  "down": function(pos, distance){return {x:pos.x, y:pos.y-distance, z:pos.z};},
  "north":function(pos, distance){return {x:pos.x, y:pos.y, z:pos.z+distance};},
  "south":function(pos, distance){return {x:pos.x, y:pos.y, z:pos.z-distance};},
  "west": function(pos, distance){return {x:pos.x-distance, y:pos.y, z:pos.z};},
  "east": function(pos, distance){return {x:pos.x+distance, y:pos.y, z:pos.z};},
  "none": function(pos, distance){return pos;}
};
var directions = ['up', 'down', 'north', 'south','east','west','none'];

/*
function Position(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
}

function getPositionFromMC(data){
  var aData = data.toString().trim().split(",");
  //console.log("aData =", aData);
  return new Position(parseInt(aData[0],10), parseInt(aData[1],10), parseInt(aData[2],10));
}

Position.prototype.add = function(oPos)
{
  return new Position(this.x+oPos.x,this.y+oPos.y,this.z+oPos.z);
};


Position.prototype.equals = function(oPos)
{
  return ((this.x === oPos.x) && (this.y === oPos.y) && (this.z === oPos.z));
};

Position.prototype.subtract = function(oPos)
{
  return new Position(this.x-oPos.x,this.y-oPos.y,this.z-oPos.z);
};

Position.prototype.set = function(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
}
*/
