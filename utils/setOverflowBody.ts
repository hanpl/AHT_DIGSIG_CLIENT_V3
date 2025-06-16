export default function (isHidden: boolean) {
    const el = document.body;
    if (isHidden)
        el.classList.add('u-overflow-hidden');
    else
        el.classList.remove('u-overflow-hidden');
}
