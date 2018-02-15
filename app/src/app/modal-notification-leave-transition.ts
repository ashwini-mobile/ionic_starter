import { Animation, PageTransition } from 'ionic-angular';

export class ModalNofLeaveTransition extends PageTransition {

  public init(): void {
      const ele: any = this.leavingView.pageRef().nativeElement;
      const wrapper: any = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

      wrapper.beforeStyles({ 'transform': 'translateY(0)', 'opacity': 1 });
      wrapper.fromTo('transform', 'translateY(0)', 'translateY(-100%)');
      wrapper.fromTo('opacity', 1, 0);

      this
          .element(this.leavingView.pageRef())
          .duration(300)
          .add(wrapper);
  }
}