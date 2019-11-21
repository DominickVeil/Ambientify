import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from 'react-native'
import _ from 'lodash'

import VolumeSlider from './VolumeSlider'
import LoopsWheelButton from './LoopsWheelButton'
import PlaybackButton from './PlaybackButton'
import LoadButton from './LoadButton'

import { loadSound, playSound } from '../../actions'
import { SOUND_FILES } from '../../constants'
import { playFromLastMillis } from '../../utils'
/**
 * TODO:
 * 
 * Implement presets functionality
 * 
 * @param {*} props 
 */

const Channel = ({ channelId }) => {
  const dispatch = useDispatch();
  const { soundObject, file, currentSoundCategory, currentSound, playing, looping } = useSelector(state => state.channels[channelId])
  const [channelTitle, setChannelTitle] = useState(`Channel ${channelId}`)

  const sound = useRef(currentSound)
  const oldSound = sound.current;

  const loadSoundWithTitle = async () => {
    await soundObject.loadAsync(file)
      .then(async () => {
        setChannelTitle(currentSound.split('_').join(' '));
        if (looping) {
          if (playing) {
            dispatch(playSound(channelId))
            playFromLastMillis(soundObject);
          }
        }
      });
  }

  useEffect(() => {
    (async () => {
      if (currentSoundCategory !== 'none') {
        let soundFile;
        if (currentSoundCategory !== 'CUSTOM') soundFile = SOUND_FILES[currentSoundCategory][currentSound];
        if (file) {
          const status = await soundObject.getStatusAsync()
          try {
            if (!status.isLoaded) {
              setChannelTitle('Loading...')
              loadSoundWithTitle();
            } else {
              // In case of new sound file being loaded by preset dispatch
              await soundObject.unloadAsync().then(async () => loadSoundWithTitle());
              if (oldSound != currentSound) dispatch(loadSound(channelId, soundFile, currentSoundCategory, currentSound))
            }
          } catch (error) { console.error('Error in loading sound in handler at Channel: ', channelId, error) }
        } else {
          if (currentSound != 'none') dispatch(loadSound(channelId, soundFile, currentSoundCategory, currentSound))
        }

      }
    })()
  }, [file, currentSound, currentSound, oldSound, currentSoundCategory])

  return (
    <>
      <View>
        <Text>
          {channelTitle}
        </Text>
        <LoadButton channelId={channelId} />
        <LoopsWheelButton channelId={channelId} />
        <PlaybackButton channelId={channelId} />
        <VolumeSlider channelId={channelId} />
      </View>
    </>
  )
}

export default Channel;