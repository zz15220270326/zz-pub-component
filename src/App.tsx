import { defineComponent } from 'vue';
import { Counter, Card } from '@/components';
import type { CounterProps } from '@/components/Counter/types';

export default defineComponent({
  name: 'TsxApp',
  setup(props, { slots }) {
    return () => (
      <div>
        {false && (
          <Counter count={1}>
            {{
              header: (props: CounterProps) => (
                <h1>父组件渲染 {`<Counter value:${props.count}>`} 头部</h1>
              ),
              default: (props: CounterProps) => (
                <div>
                  父组件需要用到里面的 count: {props.count}
                </div>
              ),
            }}
          </Counter>
        )}
        <Card
          // header="Card Header"
          // footer="Card Footer"
        >
          {{
            header: () => (
              'Yummy hamburger'
            ),
            default: () => (
              <main>
                {/* {
                  // 生成 100个 p 便签，内容为 [内容]
                  Array.from({ length: 4 }, (_, i) => (
                    <p key={i}>List item {i + 1}</p>
                  ))
                } */}
                <img
                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                />
              </main>
            ),
            // footer: () => (
            //   '底部'
            // ),
          }}
        </Card>
      </div>
    );
  },
});