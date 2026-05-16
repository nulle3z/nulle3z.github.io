 /* album.js 修改后的内容 */
const config = {
    perPage: 8,
    visiblePages: 5
};

class Pagination {
    constructor() {
        this.currentPage = 1;
        this.images = document.querySelectorAll('.image-item');
        this.totalPages = Math.ceil(this.images.length / config.perPage);
        this.init();
    }

    init() {
        this.setupPagination();
        this.showPage(1);
        this.bindImageClick();
    }

    setupPagination() {
        const container = document.querySelector('.page-numbers');
        let html = '';
        
        for(let i=1; i<=this.totalPages; i++) {
            html += `<span class="page-item">${i}</span>`;
        }
        container.innerHTML = html;

        this.bindPageEvents();
    }

    bindPageEvents() {
        document.querySelectorAll('.page-item').forEach(item => {
            const text = item.textContent;
            if(text === '上一页') {
                item.addEventListener('click', () => this.prevPage());
            } else if(text === '下一页') {
                item.addEventListener('click', () => this.nextPage());
            } else {
                item.addEventListener('click', () => 
                    this.showPage(parseInt(text)));
            }
        });
    }

    bindImageClick() {
        document.querySelectorAll('.thumbnail').forEach(img => {
            img.addEventListener('click', () => {
                const modal = document.getElementById('modal');
                const expandedImg = document.getElementById('expandedImg');
                modal.style.display = "flex";
                expandedImg.src = img.src;
                
                if (expandedImg.complete) {
                    centerImage(expandedImg);
                } else {
                    expandedImg.onload = function() {
                        centerImage(this);
                    };
                }
            });
        });
    }

    showPage(page) {
        this.currentPage = page;
        const start = (page - 1) * config.perPage;
        const end = start + config.perPage;

        this.images.forEach((img, index) => {
            img.classList.toggle('active', index >= start && index < end);
        });

        this.updatePager();
    }

    prevPage() {
        if(this.currentPage > 1) this.showPage(this.currentPage - 1);
    }

    nextPage() {
        if(this.currentPage < this.totalPages) this.showPage(this.currentPage + 1);
    }

    updatePager() {
        document.querySelectorAll('.page-item').forEach(page => {
            const pageNum = parseInt(page.textContent);
            page.classList.toggle('active', pageNum === this.currentPage);
        });

        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        if (prevBtn) {
            prevBtn.classList.toggle('disabled', this.currentPage === 1);
        }
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', this.currentPage === this.totalPages);
        }
    }
}

function centerImage(img) {
    console.log('图片已加载并居中');
}

function handleImageLoad() {
    document.querySelectorAll('.thumbnail').forEach(img => {
        if(img.complete) {
            img.closest('.image-item').classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.closest('.image-item').classList.add('loaded');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Pagination();
    handleImageLoad();

    document.querySelector('.close-btn').onclick = () => {
        document.getElementById('modal').style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == document.getElementById('modal')) {
            document.getElementById('modal').style.display = "none";
        }
    };

    window.addEventListener('resize', () => {
        gallery.showPage(gallery.currentPage);
    });
});
