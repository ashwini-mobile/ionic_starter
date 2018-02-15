import { Animation, PageTransition } from 'ionic-angular';

export class ModalDetailCardEnterTransition extends PageTransition {

  public init(): void {
    const ele: any = this.enteringView.pageRef().nativeElement;
    const wrapper: any = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

    wrapper.beforeStyles({ 'transform': 'scale(0)', 'opacity': 1 });
    wrapper.fromTo('transform', 'scale(0)', 'scale(1)');
    wrapper.fromTo('opacity', 0, 1);

    this
        .element(this.enteringView.pageRef())
        .duration(300)
        .add(wrapper);
  }
}