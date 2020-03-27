import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Animated, PanResponder, ViewPropTypes } from "react-native";
import { connectStyle } from 'native-base';
import clamp from "clamp"; // required in 'native-base'


const SWIPE_THRESHOLD = 120;

class CustomComponent extends Component {

    static propTypes = {
        ...ViewPropTypes,
        dataSource: PropTypes.array,
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.array
        ]),
        onRenderEnd: PropTypes.func
    }

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      enter2: new Animated.Value(0.8),
      enter3: new Animated.Value(0.8),
      selectedItem: this.props.dataSource[0],
      selectedItem2: this.props.dataSource[1],
      selectedItem3: this.props.dataSource[ this.props.dataSource.length - 1 ],
      fadeAnim2: new Animated.Value(0.8),
      fadeAnim3: new Animated.Value(0.8),
      looping: typeof this.props.looping === "undefined" ? true : this.props.looping, // TODO: NB: 'looping=false' not ever tested
      disabled: this.props.dataSource.length === 0,
      lastCard: this.props.dataSource.length === 1
    };
  }

  componentWillReceiveProps({ dataSource }) {
    if (dataSource.length !== this.props.dataSource.length) {
      if (dataSource.length <= 1) {
        this.setState({
          ...this.state,
          selectedItem: dataSource[0],
          selectedItem2: undefined,
          selectedItem3: undefined,
          disabled: dataSource.length === 0,
          lastCard: dataSource.length === 1
        });
        return;
      }

      const visibleIndex = dataSource.indexOf(this.state.selectedItem);
      const currentIndex = (visibleIndex < 0) ? visibleIndex + 1 : visibleIndex;
      const nextIndex = (currentIndex + 1 === dataSource.length) ? 0 : currentIndex + 1;

      let prevIndex = currentIndex - 1;
      if (dataSource.length < 3) {
        prevIndex = undefined;
      } else {
        if (prevIndex < 0) {
          prevIndex = dataSource.length + prevIndex;
        }
      }


      this.setState({
        selectedItem  : dataSource[currentIndex],
        selectedItem2 : dataSource[nextIndex],
        selectedItem3 : (prevIndex !== undefined) ? dataSource[prevIndex] : prevIndex
      });
    }
  }

  getInitialStyle() {
    return {
      topCard: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0
      }
    };
  }

  findNextIndexes(currentIndex, backwards = false) {
    if (backwards === false) {
        let newCurrentIndex = currentIndex + 1;
        let newNextIndex = currentIndex + 2;
        let newPrevIndex = currentIndex;
        
        if (this.props.dataSource.length < 3) {
            newPrevIndex = undefined;
        }
        
        if (
            newNextIndex > this.props.dataSource.length - 1
            && newCurrentIndex === this.props.dataSource.length - 1
        ) {
            return [newCurrentIndex, 0, newPrevIndex];
        }
        else if (newCurrentIndex > this.props.dataSource.length - 1) {
            return [0, 1, newPrevIndex];
        }
        
        return [newCurrentIndex, newNextIndex, newPrevIndex];
    }
    else {
        let newCurrentIndex = currentIndex - 1;
        let newNextIndex = currentIndex;
        let newPrevIndex = currentIndex - 2;
        
        if (this.props.dataSource.length < 3) {
            newPrevIndex = undefined;
        } else {
            /* if (newPrevIndex === -2) {
                newPrevIndex = this.props.dataSource.length - 2;
            }
            if (newPrevIndex === -1) {
                newPrevIndex = this.props.dataSource.length - 1;
            } */
            if (newPrevIndex < 0) {
                newPrevIndex = this.props.dataSource.length + newPrevIndex;
            }
        }

        if (newCurrentIndex === -1) {
            newCurrentIndex = this.props.dataSource.length - 1
        }
        
        return [newCurrentIndex, newNextIndex, newPrevIndex];
    }
  }

  selectNext() {
    const dataSource = this.props.dataSource;
    const currentIndex = dataSource.indexOf(this.state.selectedItem);

    // TODO: NB! 'looping=false' not ever tested
    /* // if not looping, check for these conditionals and if true return from selectNext()
    if (!this.state.looping) {
      // reached end -> only display static renderEmpty() -> no swiping
      if (currentIndex === dataSource.length - 1) {
        return this.setState({
          disabled: true
        });
      } else if (currentIndex === dataSource.length - 2) {
        // show last card with renderEmpty() component behind it
        return setTimeout(() => {
          this.setState({
            selectedItem: dataSource[currentIndex + 1]
          });
          setTimeout(() => {
            this.setState({
              lastCard: true
            });
          }, 350);
        }, 50);
      }
    } */

    const nextIndexes = this.findNextIndexes(currentIndex);
    setTimeout(() => {
      this.setState({
        selectedItem: this.props.dataSource[nextIndexes[0]]
      });
      setTimeout(() => {
        this.setState({
          selectedItem2: this.props.dataSource[nextIndexes[1]],
          selectedItem3: this.props.dataSource[nextIndexes[2]]
        });
      }, 350);
    }, 50);
  }

  selectPrev() {
    const dataSource = this.props.dataSource;
    const currentIndex = dataSource.indexOf(this.state.selectedItem);

    // if not looping, check for these conditionals and if true return from selectPrev()
    
    // TODO: NB! 'looping=false' not ever tested
    /*
    if (!this.state.looping) {
      // reached first -> only display static renderEmpty() -> no swiping
      if (currentIndex === dataSource.length - 1) {
        return this.setState({
          disabled: true
        });
      } else if (currentIndex === dataSource.length - 2) {
        // show last card with renderEmpty() component behind it
        return setTimeout(() => {
          this.setState({
            selectedItem: dataSource[currentIndex + 1]
          });
          setTimeout(() => {
            this.setState({
              lastCard: true
            });
          }, 350);
        }, 50);
      }
    } */


    const nextIndexes = this.findNextIndexes(currentIndex, true);
    setTimeout(() => {
      this.setState({
        selectedItem: this.props.dataSource[nextIndexes[0]]
      });
      setTimeout(() => {
        this.setState({
          selectedItem2: this.props.dataSource[nextIndexes[1]],
          selectedItem3: this.props.dataSource[nextIndexes[2]]
        });
      }, 350);
    }, 50);
  }

  swipeRight() {
    if (this.props.onSwiping) this.props.onSwiping("right");
    setTimeout(() => {
      Animated.timing(this.state.fadeAnim3, { toValue: 1 }).start();
      Animated.spring(this.state.enter3, { toValue: 1, friction: 7 }).start();
      this.selectPrev();
      Animated.decay(this.state.pan, {
        velocity: { x: 8, y: 1 },
        deceleration: 0.98
      }).start(this._resetState.bind(this));
    }, 300);
  }

  swipeLeft() {
    if (this.props.onSwiping) this.props.onSwiping("left");
    setTimeout(() => {
      Animated.timing(this.state.fadeAnim3, { toValue: 0, duration : 0 }).start();
      Animated.timing(this.state.fadeAnim2, { toValue: 1 }).start();
      Animated.spring(this.state.enter2, { toValue: 1, friction: 7 }).start();
      this.selectNext();
      Animated.decay(this.state.pan, {
        velocity: { x: -8, y: 1 },
        deceleration: 0.98
      }).start(this._resetState.bind(this));
    }, 300);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 5,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({
          x: this.state.pan.x._value,
          y: this.state.pan.y._value
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx > 20) {
          if (this.props.onSwiping)
            this.props.onSwiping("right", gestureState.dx);
        } else if (gestureState.dx < -20) {
          if (this.props.onSwiping)
            this.props.onSwiping("left", gestureState.dx);
        }
        let val = Math.abs(gestureState.dx * 0.0013);
        const opa = Math.abs(gestureState.dx * 0.0022);
        if (val > 0.2) {
          val = 0.2;
        }
        
        if (gestureState.dx > 0) { //swipe right
            Animated.timing(this.state.fadeAnim3, { toValue: 0.8 + val }).start();
            Animated.spring(this.state.enter3, {
              toValue: 0.8 + val,
              friction: 7
            }).start();
        } else {
            Animated.timing(this.state.fadeAnim3, { toValue: 0, duration : 0 }).start();
            Animated.timing(this.state.fadeAnim2, { toValue: 0.8 + val }).start();
            Animated.spring(this.state.enter2, {
              toValue: 0.8 + val,
              friction: 7
            }).start();
        }
        
        Animated.event([null, { dx: this.state.pan.x }])(e, gestureState);
      },

      onPanResponderRelease: (e, { vx, vy }) => {
        if (this.props.onSwiping) this.props.onSwiping(null);
        let velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 4.5, 10);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 4.5, 10) * -1;
        }

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          if (velocity > 0) {
            this.props.onSwipeRight
              ? this.props.onSwipeRight(this.state.selectedItem)
              : undefined;
            this.selectPrev();
          } else {
            this.props.onSwipeLeft
              ? this.props.onSwipeLeft(this.state.selectedItem)
              : undefined;
            this.selectNext();
          }

          Animated.decay(this.state.pan, {
            velocity: { x: velocity, y: vy },
            deceleration: 0.98
          }).start(this._resetState.bind(this));
        } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start();
        }
      }
    });
  }

  _resetState() {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.state.enter2.setValue(0.8);
    this.state.enter3.setValue(0.8);
    this.state.fadeAnim2.setValue(0.8);
    this.state.fadeAnim3.setValue(0.8);
    if (this.props.onSwiping) this.props.onSwiping(null);
    this.forceUpdate();
  }

  getCardStyles() {
    const { pan, enter2, enter3 } = this.state;

    const [translateX, translateY] = [pan.x, pan.y];

    const rotate = pan.x.interpolate({
      inputRange: [-700, 0, 700],
      outputRange: ["-10deg", "0deg", "10deg"]
    });

    const opacity = pan.x.interpolate({
      inputRange: [-320, 0, 320],
      outputRange: [0.9, 1, 0.9]
    });
    const scale2 = enter2;
    const scale3 = enter3;

    const animatedCardStyles = {
      transform: [{ translateX }, { translateY }, { rotate }],
      opacity
    };
    
    const animatedCardStyles2 = { transform: [{ 'scale' : scale2 }] };
    const animatedCardStyles3 = { transform: [{ 'scale' : scale3 }] };

    return [animatedCardStyles, animatedCardStyles2, animatedCardStyles3];
  }

  render() {
    if (typeof(this.props.onRenderStart) === 'function') {
        this.props.onRenderStart(this);
    }

    if (this.state.disabled) {
      // disable swiping and renderEmpty
      return (
        <View style={{ position: "relative", flexDirection: "column" }}>
          {<View>{this.props.renderEmpty && this.props.renderEmpty()}</View>}
        </View>
      );
    } 
    else if (this.state.lastCard) {
      // display renderEmpty underneath last viable card
      return (
        <View style={{ position: "relative", flexDirection: "column" }}>
          {this.state.selectedItem === undefined ? (
            <View />
          ) : (
            <View>
              <Animated.View
                style={[
                  this.getCardStyles()[1],
                  this.getInitialStyle().topCard,
                  { opacity: this.state.fadeAnim2 }
                ]}
                {...this._panResponder.panHandlers}
              >
                {this.props.renderItem(this.state.selectedItem)}
              </Animated.View>
              <Animated.View
                style={[
                  this.getCardStyles()[2],
                  this.getInitialStyle().topCard,
                  { opacity: this.state.fadeAnim3 }
                ]}
                {...this._panResponder.panHandlers}
              >
                {this.props.renderItem(this.state.selectedItem)}
              </Animated.View>
              <Animated.View
                style={[
                  this.getCardStyles()[0],
                  this.getInitialStyle().topCard
                ]}
                {...this._panResponder.panHandlers}
              >
                {this.props.renderItem(this.state.selectedItem)}
              </Animated.View>
            </View>
          )}
        </View>
      );
    }
    return (
      <View style={{ position: "relative", flexDirection: "column" }}>
        {this.state.selectedItem === undefined ? (
          <View />
        ) : (
          <View>
            {
                /* Next */
                this.state.selectedItem2 === undefined
                ? ( null )
                : (
                    <Animated.View
                      style={[
                        this.getCardStyles()[1],
                        this.getInitialStyle().topCard,
                        { opacity: this.state.fadeAnim2 }
                      ]}
                      {...this._panResponder.panHandlers}
                    >
                      {this.props.renderBottom
                        ? this.props.renderBottom(this.state.selectedItem2)
                        : this.props.renderItem(this.state.selectedItem2)}
                    </Animated.View>
                  )
            }
            {
                /* Prev */
                this.state.selectedItem3 === undefined
                ? (
                    <Animated.View
                      style={[
                        this.getCardStyles()[2],
                        this.getInitialStyle().topCard,
                        { opacity: this.state.fadeAnim3 }
                      ]}
                      {...this._panResponder.panHandlers}
                    >
                      {this.props.renderItem(this.state.selectedItem2)}
                    </Animated.View>

                  )
                : (
                    <Animated.View
                      style={[
                        this.getCardStyles()[2],
                        this.getInitialStyle().topCard,
                        { opacity: this.state.fadeAnim3 }
                      ]}
                      {...this._panResponder.panHandlers}
                    >
                      {this.props.renderBottom
                        ? this.props.renderBottom(this.state.selectedItem3)
                        : this.props.renderItem(this.state.selectedItem3)}
                    </Animated.View>
                  )
            }
            {/* Current */}
            <Animated.View
              style={[
                this.getCardStyles()[0],
                this.getInitialStyle().topCard
              ]}
              {...this._panResponder.panHandlers}
            >
              {this.props.renderTop
                ? this.props.renderTop(this.state.selectedItem)
                : this.props.renderItem(this.state.selectedItem)}
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
}

// connect the component to the theme
const themedDeskSwiper=connectStyle('_CustomComponents.DeckSwiper', {})(CustomComponent);
export {themedDeskSwiper as DeckSwiper}