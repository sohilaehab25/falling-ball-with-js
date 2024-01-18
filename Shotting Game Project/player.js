class player{

    constructor(top,left,redius,color,volicity){
        // الداير بخدتا البوزيشن بتاعها  الطول من طول الكانفا نفسه والعرض من عرض الكانفا الاتنين اللي هم التوب والليفت وكمان بتاخد الريدياس اللي هيحدد حجم الدايرة وكمان اللون
        this.top=top,
        this.left=left,
        this.redius=redius;
        this.color=color;
        this.volicity=volicity;
    }
  
  
     draw() {
      context.beginPath();
      context.arc(this.top, this.left, this.redius, 0, Math.PI * 2, false);
      context.fillStyle = this.color;
      context.fill();
  }
  
  move(speed) {
    if (this.top + speed - this.redius > 0 && this.top + speed + this.redius < canvas.width) {
      this.top += speed;
    }
  
   
  }
  }
  
  
   
  
  class polit{
    constructor(top,left,redius,color,volicity){
      this.top=top;
      this.left=left;
      this.redius=redius;
      this.color=color;
      this.volicity=volicity;
    }
  
    draw() {
      context.beginPath();
      context.arc(this.top, this.left, this.redius, 0, Math.PI * 2, false);
      context.fillStyle = this.color;
      context.fill();
  }
  
  update(){
    //draw this of object there so we can draw each object we creat it by calling update();
    this.draw();
    this.top = this.top + this.volicity.top;
    this.left = this.left + this.volicity.left;
  }
  
  move(speed) {
    this.top+=speed;
  }
  
  
  }
  
  
  class enemy{
    constructor(top,left,redius,color,volicity){
      this.top=top;
      this.left=left;
      this.redius=redius;
      this.color=color;
      this.volicity=volicity;
    }
  
    draw() {
      //to start draw circle;
      context.beginPath();
  
      //for actuall drawing the circle;
      context.arc(this.top, this.left, this.redius, 0, Math.PI * 2, false);
      context.fillStyle = this.color;
  
      //for filling the circle place in the window
      context.fill();
  }
  
  
  update(){
    //draw this of object there so we draw each object we creat it;
    this.draw();
    this.top = this.top + this.volicity.top*2;
    this.left = this.left + this.volicity.left*2;
  }
  
  }
  
 