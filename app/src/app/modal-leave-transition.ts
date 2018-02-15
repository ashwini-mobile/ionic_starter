import { Animation, PageTransition } from 'ionic-angular';

export class ModalLeaveTransition extends PageTransition {

  public init(): void {
      const ele: any = this.leavingView.pageRef().nativeElement;
      const wrapper: any = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

      wrapper.beforeStyles({ 'transform': 'translateX(0)', 'opacity': 1 });
      wrapper.fromTo('transform', 'translateX(0)', 'translateX(100%)');
      wrapper.fromTo('opacity', 1, 0);

      this
          .element(this.leavingView.pageRef())
          .duration(300)
          .add(wrapper);
  }
}