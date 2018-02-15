import { Animation, PageTransition } from 'ionic-angular';

export class ModalDetailCardLeaveTransition extends PageTransition {

  public init(): void {
      const ele: any = this.leavingView.pageRef().nativeElement;
      const wrapper: any = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

      wrapper.beforeStyles({ 'transform': 'scale(1)', 'opacity': 1 });
      wrapper.fromTo('transform', 'scale(1)', 'scale(0)');
      wrapper.fromTo('opacity', 1, 0);

      this
          .element(this.leavingView.pageRef())
          .duration(300)
          .add(wrapper);
  }
}