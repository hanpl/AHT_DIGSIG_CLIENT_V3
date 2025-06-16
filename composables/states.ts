export const useWindow = defineStore('window', {
    state: () => (
        {
            modal: {
                //Đánh dấu modal nào đang show:
                //0 - Ko có; 
                //1 - AddToCartConfirm;
                //2 - Mobile Sidebar;
                //3 - LoginModal;
                //4 - ForgotPasswordModal;
                //5 - CreateAccountModal;
                //6 - LoveSignInModal;
                modalShowingId: 0,
                allowHeader: false
            },
            size: {
                currentSize: 0,     //Lưu giá trị windowSize hiện tại
                isUnder760: true,   //Giá trị init = true để khi UI chạy lần đầu chỉ tải resource cho mobile -> Nhẹ, loading nhanh
                isUnder1280: true
            }
        }),
    getters: {
        get: (state) => state
    },
    actions: {
        openModal(p_modalId: number, p_allowHeader = false) {
            if (p_modalId != 0) {
                this.modal.modalShowingId = p_modalId;
                this.modal.allowHeader = p_allowHeader;
                setOverflowBody(true);
            }
        },
        
        //Khi user click bên ngoài modal đang show -> Close model
        closeModal() {
            this.modal = {
                modalShowingId: 0,
                allowHeader: false
            };
            setOverflowBody(false);
        }
    }
})
