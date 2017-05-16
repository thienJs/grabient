import Component from 'inferno-component'
import styled from 'styled-components'
import { connect } from 'inferno-redux'

import { angleToLines } from './../../utils/angle'

import { toggleEditing } from './../../store/gradients/actions'

import { AnglePreview, GradientContainer } from './../../components/index'
import { AddColor } from './../../components/Icons/index'

const GRADIENT_ANIMATION_DURATION = 500
const ANGLE_WHEEL_ANIMATION_DURATION = 300
const ANGLE_PREVIEW_ANIMATION_DURATION = 200
const SWATCH_ANIMATION_DURATION = 300

const Container = styled.div`
  width: 33.33%;
  height: 35vw;
  max-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 3% 10px;
  position: relative;
`

const AngleContainer = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const AngleText = styled.div`
  font-size: 1.6rem;
  color: #AFAFAF;
  padding-left: 10px;
`

const SwatchContainer = styled.div`
  position: relative;
  width: 100%;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 10;
  bottom: 15px;
`

const AddColorContainer = styled.div`
  height: 25px;
  margin-left: 15px;
  cursor: pointer;
`

const StopKeys = ({ gradient }) => {
  const stopKeys = Object.keys(gradient)
  return stopKeys.map(stopKey => (
    <stop
      key={stopKey}
      stop-color={gradient[stopKey].color}
      offset={gradient[stopKey].stop + '%'}
    />
  ))
}

class GradientCard extends Component {
  state = {
    hovered: {
      arrowPrev: false,
      addColor: false,
      main: false
    },
    wasEditing: false
  }

  componentWillReceiveProps (nextProps) {
    const { editing } = this.props
    if (editing !== nextProps.editing) {
      this.setState({ wasEditing: !nextProps.editing })
    }
  }

  _handleMouseEnter = (e, el) => {
    if (!this.state.wasEditing) {
      const newState = { ...this.state }
      newState.hovered[el] = true
      this.setState(newState)
    }
  }

  _handleMouseLeave = (e, el) => {
    const newState = { ...this.state }
    newState.hovered[el] = false
    newState.wasEditing = false

    this.setState(newState)
  }

  render () {
    const { hovered: { arrowPrev, addColor, main }, wasEditing } = this.state
    const {
      gradient: { gradient },
      children,
      id,
      toggleEditing,
      angle
    } = this.props
    const lines = angleToLines(angle)
    const Stops = StopKeys({ gradient })
    return (
      <Container>
        <GradientContainer
          gradientAnimationDuration={GRADIENT_ANIMATION_DURATION}
          wheelAnimationDuration={ANGLE_WHEEL_ANIMATION_DURATION}
          id={id}
          gradient={this.props.gradient}
          angle={angle}
        />

        <SwatchContainer>
          <AngleContainer
            onClick={() => toggleEditing(id)}
            onMouseEnter={e => this._handleMouseEnter(e, 'arrowPrev')}
            onMouseLeave={e => this._handleMouseLeave(e, 'arrowPrev')}
          >
            <AnglePreview
              angle={angle}
              animationDuration={ANGLE_PREVIEW_ANIMATION_DURATION}
              hovered={arrowPrev}
            />
            <AngleText>{angle}°</AngleText>
          </AngleContainer>

          {children}

          <AddColorContainer
            onMouseEnter={e => this._handleMouseEnter(e, 'addColor')}
            onMouseLeave={e => this._handleMouseLeave(e, 'addColor')}
          >
            <AddColor
              anmationDuration={SWATCH_ANIMATION_DURATION}
              hovered={addColor}
              color='#AFAFAF'
            />
          </AddColorContainer>
        </SwatchContainer>
      </Container>
    )
  }
}

export default connect(
  ({ gradients: { editingAngle } }, { id, gradient }) => ({
    editing: id == editingAngle.id,
    angle: id == editingAngle.id
      ? editingAngle.angle === null ? gradient.angle : editingAngle.angle
      : gradient.angle
  }),
  { toggleEditing }
)(GradientCard)
