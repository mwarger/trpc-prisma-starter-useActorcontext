import { createActorContext } from '@xstate/react';
import { createMachine } from 'xstate';
import { RouterOutput } from '../utils/trpc';

export const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAUD2sAusB0BLAdrhgMQDaADALqKgAO6Ruq+NIAHogEwCMA7NgDZuADgG8hI8gFZunXgBoQAT0R8AnNgAsAZl7b9sngKmdtAXzOK0mHLDABDAE4BjABbEIzMHnwA3VADW3tZY2HZObggE-s72GEz4FJRJrPSwjMysHAg8-EKi4tySMnKKKgjC3FrCvJoCano65Jzk3BZW6KHhLu5gjo6ojti0ADZxAGaDALbYIbYOPVF+qLHxzEkpSCBpGSxb2QKa-OTa3OR6nJwC2pxqnGWqN9hqApyarZqcwqbar+0gc2wjjgAFcRlgAPqwEHOZxwWDEbpuTZ0BhrPagbK5QQiMQSYTSWQKZSqL7PV7vL48chiKS8CyWED4VAQOCsOapNEJLKIAC0AgeCH52HIotaUjU2iOrTUsv+gIIRE56XRPIQsmE2GEpz43ylvF4RW0gt1WjkdwJRO1UmE8s68wirmVuzVnyqtzxujOwmEEpN5E1mglPEqEvEcltjMBwOh4NgUJhcNg8C2O1V+0Qn0FohFAhOR14anIdQaajtNiBoLjEL6A0czvTmMQwk0Gl+LeEkukVzUwhNp2eJll3G0ahMvBpDLMQA */
  createMachine({
    id: 'Posts',
    initial: 'init',
    states: {
      init: {
        always: {
          target: 'search',
        },
      },
      search: {
        invoke: {
          src: 'getPosts',
          onDone: [
            {
              target: 'results_success',
            },
          ],
          onError: [
            {
              target: 'results_error',
            },
          ],
        },
      },
      results_success: {
        on: {
          search: {
            target: 'search',
          },
        },
      },
      results_error: {},
    },
    schema: {
      context: {} as {
        facilityId: string;
      },
      events: {} as { type: 'search' },
      services: {} as {
        getPosts: {
          data: RouterOutput['post']['list'];
        };
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./postMachine.typegen').Typegen0,
  });

export const PostsContext = createActorContext(
  machine,
  // REPRO: I don't want to have to supply the services here
  // this requires I add it so I need to make a "dummy" service
  {
    services: {
      getPosts: async (context) => {
        return {
          items: [],
          nextCursor: undefined,
        };
      },
    },
  },
);
