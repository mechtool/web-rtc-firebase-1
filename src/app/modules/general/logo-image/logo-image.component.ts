import {AfterViewInit, Component} from '@angular/core';
import {ColorThemeService} from "../../../services/color-theme.service";
import {Store} from "@ngxs/store";
import {AppContextState} from "../../../store/states";
declare let Snap;

@Component({
  selector: 'app-logo-image',
  templateUrl: './logo-image.component.html',
  styleUrls: ['./logo-image.component.css']
})
export class LogoImageComponent implements AfterViewInit {

    public offset;
    public svgClass = 'rad';
    public points = false;
    public circles = [
	{r : '20%', cx : '50%', cy : '50%', className : 'circle1', circle : undefined},
	{r : '20%', cx : '50%', cy : '50%', className : 'circle2', circle: undefined},
    ]
    public logoData = [
	{className : 'c0', cx : '250', cy : '250', r : '250', fill : '#a9bfff'},
	{className : 'c1', cx : '250', cy : '250', r : '200', fill : '#6f98fc'},
	{className : 'c2', cx : '250', cy : '250', r : '150', fill : '#3163fc'},
	{className : 'c3', cx : '180', cy : '250', r : '25', fill : '#fff'},
	{className : 'c4', cx : '250', cy : '250', r : '25', fill : '#fff'},
	{className : 'c5', cx : '320', cy : '250', r : '25', fill : '#fff'},
    ];
    
    constructor(public store : Store) {
      let colorClass =  this.store.selectSnapshot(AppContextState.appColorClass) ;
      this.logoData.forEach(data => {
         data.fill =  ColorThemeService.logoItems[colorClass][data.className];
      }) ;
      this.offset = ColorThemeService.logoItems[colorClass]['c0'];
  }

  ngAfterViewInit() {
        this.startAnimation();
  }
    
    startAnimation(){
	  let s : any = Snap('#snap');
	  this.circles[0].circle = s.select('.circle1');
	  this.circles[1].circle = s.select('.circle2');
	  animateCircle(this.circles[0].circle)
	  let t = setTimeout(()=>{
	      clearTimeout(t);
	      animateCircle(this.circles[1].circle);
	  }, 1000)
	
	  function animateCircle(c) {
	      c.animate({r : '50%', opacity : 0}, 2000 ,undefined, ()=>{
		  c.attr({r : '20%', opacity : 0.6});
		  animateCircle(c);
	      })
	  }
  }
  
}
