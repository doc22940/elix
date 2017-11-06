import * as props from '../../mixins/props.js';
import flushPolyfills from '../flushPolyfills.js';
import RenderPropsMixin from '../../mixins/RenderPropsMixin.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';


class RenderPropsTest extends RenderPropsMixin(ReactiveMixin(HTMLElement)) {

  get props() {
    return props.merge(super.props, {
      classes: {
        selected: this.state.selected || this.state.original.classes.selected
      },
      style: {
        color: this.state.selected ? 'red' : this.state.original.style.color
      }
    });
  }

}
customElements.define('render-props-test', RenderPropsTest);


describe("RenderPropsMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("updates host with props", async () => {
    const fixture = new RenderPropsTest();
    container.appendChild(fixture);
    assert.equal(fixture.style.color, '');
    await fixture.setState({
      selected: true
    });
    assert.equal(fixture.style.color, 'red');
    await fixture.setState({
      selected: false
    });
    // Should be back to original condition.
    assert.equal(fixture.style.color, '');
  });

  it("merges styles on top of original styles", async () => {
    container.innerHTML = `<render-props-test style="background-color: yellow; color: green;"></render-props-test>`;
    flushPolyfills();
    const fixture = container.querySelector('render-props-test');
    await fixture.setState({
      selected: true
    })
    assert.equal(fixture.style.backgroundColor, 'yellow');
    assert.equal(fixture.style.color, 'red');
      
    // Dynamically modify style.
    fixture.setAttribute('style', 'background-color: aqua; color: navy;');
    await Promise.resolve();
    assert.equal(fixture.style.backgroundColor, 'aqua');
    assert.equal(fixture.style.color, 'red');

    await fixture.setState({
      selected: false
    });
    assert.equal(fixture.style.backgroundColor, 'aqua');
    assert.equal(fixture.style.color, 'navy');    
  });

  it("merges classes on top of original classes", async () => {
    container.innerHTML = `<render-props-test class='foo'></render-props-test>`;
    flushPolyfills();
    const fixture = container.querySelector('render-props-test');
    assert(fixture.classList.contains('foo'));
    assert(!fixture.classList.contains('selected'));

    await fixture.setState({
      selected: true
    });
    assert(fixture.classList.contains('foo'));
    assert(fixture.classList.contains('selected'));

    await fixture.setState({
      selected: false
    });
    assert(fixture.classList.contains('foo'));
    assert(!fixture.classList.contains('selected'));
  });

  it("respects original classes", async () => {
    container.innerHTML = `<render-props-test class='selected'></render-props-test>`;
    flushPolyfills();
    const fixture = container.querySelector('render-props-test');
    assert(fixture.classList.contains('selected'));

    await fixture.setState({
      selected: true
    });
    assert(fixture.classList.contains('selected'));

    await fixture.setState({
      selected: false
    });
    assert(fixture.classList.contains('selected'));
  });

});
