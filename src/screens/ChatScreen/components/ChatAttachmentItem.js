import React, { useState } from 'react';
import { TouchableOpacity, View, Dimensions, Image, Text, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { withStyles, Icon } from '@ui-kitten/components';
import RecordSlider from './RecordSlider';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import ImageLoader from 'components/ImageLoader';
import { messageStamp } from 'helpers/TimeHelper';
import CustomText from 'components/Text';
import PlayVideo from './PlayVideo';
import i18n from 'i18n';

const LockIcon = style => {
  return <Icon {...style} name="lock" />;
};

const styles = theme => ({
  fileView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: Dimensions.get('window').width - 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  fileViewRight: {
    backgroundColor: theme['color-primary-default'],
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  fileViewLeft: {
    backgroundColor: theme['background-basic-color-1'],
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 8,
    borderColor: theme['color-border'],
    borderTopLeftRadius: 4,
    borderTopRightRadius: 8,
    borderWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  imageViewLeft: {
    backgroundColor: theme['background-basic-color-1'],
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 8,
    borderColor: theme['color-border'],
    borderTopLeftRadius: 4,
    borderTopRightRadius: 8,
    borderWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  imageViewRight: {
    backgroundColor: theme['color-primary-default'],
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  privateMessageContainer: {
    backgroundColor: theme['color-background-private-light'],
    borderColor: theme['color-border-activity'],
    borderWidth: 1,
    color: theme['text-basic-color'],
    paddingTop: 8,
    paddingBottom: 8,
  },
  imageLoader: {
    alignItems: 'center',
    borderRadius: 8,
    borderTopLeftRadius: 8,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 8,
    paddingBottom: 8,
  },
  image: {
    height: deviceHeight / 5,
    width: deviceWidth / 2,
    borderRadius: 8,
    alignSelf: 'center',
  },
  fileAttachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
  },
  fileAttachmentView: {
    flexDirection: 'row',
  },
  attachmentTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  filenameRightText: {
    color: theme['color-basic-100'],
    fontSize: theme['font-size-small'],
    fontWeight: theme['font-medium'],
    textAlign: 'left',
  },

  filenameLeftText: {
    color: theme['color-message-left'],
    fontSize: theme['font-size-small'],
    fontWeight: theme['font-medium'],
    textAlign: 'left',
  },
  filenameTextPrivate: {
    color: theme['color-message-left'],
  },
  downloadTextPrivate: {
    color: theme['color-primary-default'],
  },
  downloadRightText: {
    color: theme['color-background-message'],
    fontSize: theme['font-size-extra-small'],
    fontWeight: theme['font-medium'],
    textAlign: 'left',
    alignSelf: 'stretch',
    textDecorationLine: 'underline',
    paddingTop: 2,
  },
  downloadLeftText: {
    color: '#005fb8',
    fontSize: theme['font-size-extra-small'],
    fontWeight: theme['font-medium'],
    textAlign: 'left',
    alignSelf: 'stretch',
    textDecorationLine: 'underline',
    paddingTop: 2,
  },
  attachmentText: {
    fontSize: theme['text-primary-size'],
    fontWeight: theme['font-medium'],
    color: 'white',
    paddingBottom: 4,
    paddingLeft: 8,
  },
  attachmentPrivateText: {
    fontSize: theme['text-primary-size'],
    fontWeight: theme['font-medium'],
    color: theme['text-basic-color'],
    paddingBottom: 4,
    paddingLeft: 8,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  dateRight: {
    color: theme['color-background-message'],
    fontSize: theme['font-size-extra-extra-small'],
    paddingTop: 4,
  },
  dateLeft: {
    color: theme['color-gray'],
    fontSize: theme['font-size-extra-extra-small'],
    paddingTop: 4,
  },
  iconView: {
    paddingLeft: 8,
  },
  icon: {
    width: 16,
    height: 16,
  },
});

const propTypes = {
  eva: PropTypes.shape({
    style: PropTypes.object,
    theme: PropTypes.object,
  }).isRequired,
  type: PropTypes.string,
  showAttachment: PropTypes.func,
  message: PropTypes.shape({
    content: PropTypes.string,
    private: PropTypes.bool,
  }),
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      file_type: PropTypes.string,
      data_url: PropTypes.string,
    }),
  ),
  created_at: PropTypes.number,
};

export const FileIcon = style => {
  return <Icon {...style} name="play-circle-outline" width={24} height={24} />;
};

const ChatAttachmentItemComponent = ({
  type,
  showAttachment,
  attachments,
  created_at,
  message,
  eva: { style, theme },
}) => {
  console.warn(created_at, '===created_at');
  const [imageLoading, onLoadImage] = useState(false);
  const isPrivate = message.private;

  const attachmentTextStyle =
    type === 'outgoing' ? style.filenameRightText : style.filenameLeftText;

  const attachmentDownloadTextStyle =
    type === 'outgoing' ? style.downloadRightText : style.downloadLeftText;

  const attachmentIconColor =
    type === 'outgoing' ? theme['color-basic-100'] : theme['color-primary-default'];

  const attachmentContentStyle = {
    ...attachmentTextStyle,
    ...(isPrivate ? style.filenameTextPrivate : {}),
  };

  const downloadAttachmentContentStyle = {
    ...attachmentDownloadTextStyle,
    ...(isPrivate ? style.downloadTextPrivate : {}),
  };

  if (attachments && attachments.length > 0) {
    return attachments.map((attachment, index) => {
      const { file_type: fileType, data_url: dataUrl } = attachment;
      const fileName = dataUrl ? dataUrl.split('/').pop() : '';
      const fileNameWithOutExt = fileName.split('.').shift();
      const fileTypeFromName = fileName.split('.').pop();
      const fileExt = dataUrl?.split('.').reverse()[0];
      return (
        <React.Fragment key={index}>
          {fileType === 'image' ? (
            <TouchableOpacity
              onPress={() => showAttachment({ type: 'image', dataUrl })}
              style={[
                type === 'outgoing' ? style.imageViewRight : style.imageViewLeft,
                isPrivate && style.privateMessageContainer,
              ]}>
              <Image
                style={style.image}
                source={{
                  uri: dataUrl,
                }}
                onLoadStart={() => onLoadImage(true)}
                onLoadEnd={() => {
                  onLoadImage(false);
                }}
              />
              {imageLoading && <ImageLoader style={style.imageLoader} />}
            </TouchableOpacity>
          ) : (
            <View
              style={[
                type === 'outgoing' ? style.fileViewRight : style.fileViewLeft,
                style.fileView,
              ]}>
              <View style={style.fileAttachmentContainer}>
                <View style={style.fileAttachmentView}>
                  {fileType == 'audio' || fileExt === 'mp3' || fileExt === 'ogg' ? (
                    <RecordSlider
                      url={dataUrl}
                      message={attachment}
                      theme={theme}
                      type={type}
                      created_at={created_at}
                    />
                  ) : fileExt === 'mp4' || fileExt === 'mkv' || fileExt === 'flv' ? (
                    <PlayVideo
                      message={attachment}
                      theme={theme}
                      type={type}
                      created_at={created_at}
                    />
                  ) : (
                    <>
                      <View style={style.attachmentIconView}>
                        <FileIcon
                          fill={isPrivate ? theme['color-primary-default'] : attachmentIconColor}
                        />
                      </View>
                      <View style={style.attachmentTextView}>
                        <CustomText style={attachmentContentStyle}>
                          {fileName.length < 30
                            ? `${fileName}`
                            : `${fileNameWithOutExt.substr(
                                fileName.length - 30,
                              )}...${fileTypeFromName}`}
                        </CustomText>
                        <TouchableOpacity onPress={() => showAttachment({ type: 'file', dataUrl })}>
                          <CustomText style={downloadAttachmentContentStyle}>
                            {i18n.t('CONVERSATION.DOWNLOAD')}
                          </CustomText>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
        </React.Fragment>
      );
    });
  }
  return null;
};

ChatAttachmentItemComponent.propTypes = propTypes;

const ChatAttachmentItem = React.memo(withStyles(ChatAttachmentItemComponent, styles));
export default ChatAttachmentItem;
