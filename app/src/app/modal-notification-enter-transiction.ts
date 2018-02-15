import { Animation, PageTransition } from 'ionic-angular';

export class ModalNofEnterTransition extends PageTransition {

  public init(): void {
      const ele: any = this.enteringView.pageRef().nativeElement;
      const wrapper: any = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

      wrapper.beforeStyles({ 'transform': 'translateY(-100%)', 'opacity': 1 });
      wrapper.fromTo('transform', 'translateY(-100%)', 'translateY(0)');
      wrapper.fromTo('opacity', 1, 1);

      this
          .element(this.enteringView.pageRef())
          .duration(300)
          .add(wrapper);
  }
}