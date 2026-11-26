import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    app: null,
    components: [],
    revision: 0,
  }),

  actions: {
    register(componentId, componentName = componentId) {
      const store = this;

      class Status {
        constructor(componentId, componentName) {
          if (componentId === 'app') {
            store.app = this;
          } else {
            const index = store.components.findIndex(
              (c) => c.id === componentId,
            );

            if (index >= 0) {
              store.components[index] = this;
            } else {
              store.components.push(this);
            }
          }

          store.revision++;

          this.id = componentId;
          this.name = componentName;
          this.completed = 0;
          this.processed = 0;
          this.processing = 0;
          this.phases = [];
        }

        _change() {
          store.revision++;
        }

        phaseBegin(name, weight, description, critical = true, async = false) {
          this.phases.push({
            name,
            weight,
            description,
            critical,
            async,
          });

          this.processing += weight;
          this._change();
        }

        phaseEnd(name) {
          if (this.completed >= 100) {
            return;
          }

          const index = this.phases.findIndex((p) => p.name === name);

          if (index < 0) {
            return;
          }

          this.completed += this.phases[index].weight;
          this.processed += this.phases[index].weight;
          this.phases.splice(index, 1);

          this._change();
        }

        phaseFailed(name, reason) {
          if (this.completed >= 100) {
            return;
          }

          const phase = this.phases.find((p) => p.name === name);

          if (!phase) {
            return;
          }

          this.processed += phase.weight;
          phase.reason = reason;
          phase.failed = true;

          this._change();
        }

        failedPhases() {
          return this.phases.filter((p) => p.failed);
        }

        isSucceed() {
          return this.completed >= 100;
        }

        isFinished() {
          return this.processed >= 100;
        }

        isReady() {
          return (
            this.processing >= 100 &&
            this.phases.findIndex((p) => p.failed && p.critical) < 0
          );
        }

        failedMessage() {
          return this.failedPhases()
            .map((p) => p.reason)
            .join('\n');
        }
      }

      return new Status(componentId, componentName);
    },
  },
});
