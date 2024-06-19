// TODO:
void antiasan(unsigned long addr) {
    unsigned long shadow_addr = (addr >> 3) + 0x7ff8000000000000 ;
    *((unsigned char*)shadow_addr) = 0x27;
}

