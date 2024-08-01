/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ["127.0.0.1"], //에뮬레이터
        domains: ['storage.googleapis.com'], //프로덕션 모드에서 설정
    },
};

export default nextConfig;

//공식문서 https://nextjs.org/docs/app/api-reference/next-config-js/serverActions 참고할 것