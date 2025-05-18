import {
  defineComponent,
  Transition,
  Teleport,
} from 'vue';
import { messageProps, messageEmits } from '../modules/config';
import {
  useId,
  useMessageCls,
  useMessageShow,
  useMessageStyle,
  useMessageExpose,
  useMessageEvent,
  useMessageOffset,
  useMessageGrouping,
} from '../modules/hooks';

export default defineComponent({
  name: 'MyMessage',
  props: messageProps,
  emits: messageEmits,
  setup(props, { expose, emit }) {
    const id = useId();

    const {
      messageWrapCls,
      messageIconCls,
      messageContentCls,
      messageCloseIconCls,
      messageGroupingCountCls,
    } = useMessageCls(props);
    const [messageShow, setMessageShow] = useMessageShow(props, emit);
    const { offsetState, setOffset } = useMessageOffset(props);
    const { messageWrapStyle } = useMessageStyle(offsetState, props);
    const {
      handleCloseMessage,
      handleMouseEnterMessage,
      handleMouseLeaveMessage,
    } = useMessageEvent({ props, setMessageShow });
    const { groupingCount, setGroupingCount } = useMessageGrouping();

    useMessageExpose({
      id,
      messageShow,
      setMessageShow,
      setOffset,
      message: props.message,
      setGroupingCount,
    }, expose);

    return () => (
      <Teleport to={props.appendTo}>
        <Transition name={`my-message-${props.position}`}>
          <div
            v-show={messageShow.value}
            class={messageWrapCls.value}
            style={messageWrapStyle.value}
            onMouseenter={handleMouseEnterMessage}
            onMouseleave={handleMouseLeaveMessage}
          >
            <i class={messageIconCls.value} />
            {
              props.dangerouslyUseHTMLString
                ? (
                  <p
                    class={messageContentCls.value}
                    title={typeof props.message === 'string' ? props.message : ''}
                    v-html={props.message}
                  >
                  </p>
                )
                : (
                  <p
                    class={messageContentCls.value}
                    title={typeof props.message === 'string' ? props.message : ''}
                  >
                    {props.message} {/* {props.offset} */}
                  </p>
                )
            }
            {props.closable === true && (
              <i
                class={messageCloseIconCls.value}
                onClick={handleCloseMessage}
              />
            )}
            {
              props.grouping && (
                <i class={messageGroupingCountCls.value}>{groupingCount.value}</i>
              )
            }
          </div>
        </Transition>
      </Teleport>
    );
  },
});
