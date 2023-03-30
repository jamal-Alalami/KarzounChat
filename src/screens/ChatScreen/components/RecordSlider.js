import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Icon } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';
import { messageStamp } from '../../../helpers/TimeHelper';
import { decodeOpus } from 'react-native-opus-decode';

const audioRecorderPlayer = new AudioRecorderPlayer();
const RecordSlider = props => {
  const [currentPositionSec, setCurrentPositionSec] = React.useState(0);
  const [currentDurationSec, setCurrentDurationSec] = React.useState('00:00');
  // const [recordPlaying, setRecordPlaying] = React.useState(false)
  const playerState = React.useRef('stopped');
  // const recordPlayingId = useSelector(state => state.conversation.recordPlayingId);
  const recordPlayingId = '';
  const dispatch = useDispatch();
  // console.log('rendered',props.message);
  useEffect(() => {
    if (playerState.current !== 'stopped' && recordPlayingId !== props.message.message_id) {
      playerState.current = 'stopped';
      setCurrentPositionSec(0);
    }
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [recordPlayingId]);
  const onStartPlay = async recordPath => {
    // dispatch({ type: IS_RECORD_PLAYING, payload: true })
    // await audioRecorderPlayer.stopPlayer()

    // await audioRecorderPlayer.startPlayer(recordPath);
    // currentPositionSec !== 0 && await audioRecorderPlayer.seekToPlayer(currentPositionSec)
    // audioRecorderPlayer.addPlayBackListener(e => {
    //     setCurrentPositionSec(e.duration == e.currentPosition ? 0 : e.currentPosition)
    //     if(e.duration == e.currentPosition){
    //         onStopPlay()
    //         setRecordPlaying(false)
    //     }
    //     currentDurationSec === '00:00' && setCurrentDurationSec(e.duration)
    // });

    if (playerState.current === 'played') {
      // dispatch({ type: CHANGE_RECORD_PLAYING_ID, payload: props.message.message_id });
      try {
        // await audioRecorderPlayer.stopPlayer();
        // const details = await decodeOpus(recordPath);
        // console.warn(details, '===details');
        const ss = await audioRecorderPlayer.startPlayer(recordPath);
        console.warn(ss, '===seeee');
        audioRecorderPlayer.addPlayBackListener(e => {
          console.warn(e, '===eee');
          if (e.duration == e.currentPosition) {
            playerState.current = 'stopped';
            onStopPlay();
          }
          setCurrentPositionSec(e.duration == e.currentPosition ? 0 : e.currentPosition);
          currentDurationSec === '00:00' && setCurrentDurationSec(e.duration);
        });
      } catch (error) {
        console.warn(error, '====');
      }
    } else if (playerState.current === 'paused') {
      await audioRecorderPlayer.pausePlayer();
    } else if (playerState.current === 'resumed') {
      await audioRecorderPlayer.resumePlayer();
    }
  };
  async function onStopPlay() {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          switch (playerState.current) {
            case 'stopped':
              playerState.current = 'played';
              break;
            case 'played':
              playerState.current = 'paused';
              break;
            case 'paused':
              playerState.current = 'resumed';
              break;
            default:
              playerState.current = 'paused';
          }
          onStartPlay(props.message.data_url);
          // !recordPlaying ? onStartPlay(props.message.data_url) : onStopPlay()
          // setRecordPlaying(!recordPlaying)
        }}
        style={styles.recordButton}>
        <Icon
          fill={props.type === 'outgoing' ? '#fff' : props.theme['color-primary-default']}
          name={
            playerState.current == 'played' || playerState.current == 'resumed'
              ? 'pause-circle-outline'
              : 'play-circle-outline'
          }
          width={36}
          height={36}
        />
        {/* <Icon fill={props.theme['color-primary-default']} name={recordPlaying ? "pause-circle-outline" : "play-circle-outline"} width={36} height={36} /> */}
      </TouchableOpacity>
      <View>
        <Slider
          style={{
            width: 200,
            height: 25,
            // transform: [{ rotate:  I18nManager.isRTL ?'180deg':"0deg" }]
            //I18nManager.isRTL ?  : '0deg',
          }}
          value={currentPositionSec}
          minimumValue={0}
          thumbTintColor={
            props.type === 'outgoing' ? 'white' : props.theme['color-primary-default']
          }
          maximumValue={currentDurationSec === '00:00' ? 0 : currentDurationSec}
          minimumTrackTintColor={props.type === 'outgoing' ? 'white' : 'red'}
          maximumTrackTintColor={
            props.type === 'outgoing' ? 'white' : props.theme['color-primary-default']
          }
          // onValueChange={value => {
          //     console.log('on change value',value)
          // }}
          onSlidingComplete={v => audioRecorderPlayer.seekToPlayer(v)}
        />
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 11 }}>
          <Text style={{ fontSize: 10, color: props.type === 'outgoing' ? '#fff' : '#666' }}>
            {messageStamp({ time: props.created_at })}
          </Text>
          <Text style={{ fontSize: 10, color: props.type === 'outgoing' ? '#fff' : '#666' }}>
            {audioRecorderPlayer.mmss(Math.floor(currentPositionSec / 1000))}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(RecordSlider);

const styles = StyleSheet.create({
  container: {
    // padding: '3%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  recordButton: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // backgroundColor: 'red',
    // alignItems: 'center',
    // justifyContent: 'center',
    // alignSelf: 'flex-end',
  },
});
