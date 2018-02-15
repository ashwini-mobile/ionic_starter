import { Animation, PageTransition } from 'ionic-angular';

export class ModalEnterTransition extends PageTransition {

  public init(): void {
      const ele: any = this.enteringView.pageRef().nativeElement;
      const wrapper: any = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

      wrapper.beforeStyles({ 'transform': 'translateX(100%)', 'opacity': 1 });
      wrapper.fromTo('transform', 'translateX(100%)', 'translateX(0)');
      wrapper.fromTo('opacity', 1, 1);

      this
          .element(this.enteringView.pageRef())
          .duration(300)
          .add(wrapper);
  }
}