import { ActionTree } from 'vuex'
import { RootState } from '@/store/types'
import { GuiWebcamState, GuiWebcamStateWebcam } from '@/store/gui/webcams/types'
import Vue from 'vue'

export const actions: ActionTree<GuiWebcamState, RootState> = {
    reset({ commit }) {
        commit('reset')
    },

    init() {
        window.console.debug('init gui/webcams')
        Vue.$socket.emit('server.webcams.list', {}, { action: 'gui/webcams/initStore' })
    },

    async initStore({ commit, dispatch }, payload) {
        await commit('reset')
        await commit('initStore', payload.webcams)
        await dispatch('socket/removeInitModule', 'gui/webcam/init', { root: true })
    },

    store(_, payload) {
        Vue.$socket.emit('server.webcams.post_item', payload)
    },

    update({ dispatch }, payload: { webcam: GuiWebcamStateWebcam; oldWebcamName: string }) {
        Vue.$socket.emit('server.webcams.post_item', payload.webcam)
        if (payload.webcam.name !== payload.oldWebcamName) dispatch('delete', payload.oldWebcamName)
    },

    delete(_, payload: string) {
        Vue.$socket.emit('server.webcams.delete_item', { name: payload })
    },
}
